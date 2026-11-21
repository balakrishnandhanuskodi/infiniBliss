-- infiniBliss: identity, Account Number, roles, devices, audit log.
-- Design: docs/identity-and-accounts.md

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('seeker', 'rm', 'moderator', 'admin');
create type public.account_status as enum ('active', 'deleted');

-- ---------------------------------------------------------------------------
-- Account Number: 'IB' + 9 random digits + 1 Luhn check digit (immutable)
-- ---------------------------------------------------------------------------
create function public.luhn_check_digit(payload text)
returns int
language plpgsql
immutable
set search_path = ''
as $$
declare
  total int := 0;
  d int;
  i int;
  n int := length(payload);
begin
  -- Walk from the rightmost payload digit; it is doubled because the check
  -- digit will be appended to its right.
  for i in 0 .. n - 1 loop
    d := substr(payload, n - i, 1)::int;
    if i % 2 = 0 then
      d := d * 2;
      if d > 9 then d := d - 9; end if;
    end if;
    total := total + d;
  end loop;
  return (10 - total % 10) % 10;
end;
$$;

create function public.is_valid_account_number(acct text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select acct ~ '^IB[0-9]{10}$'
     and public.luhn_check_digit(substr(acct, 3, 9)) = substr(acct, 12, 1)::int;
$$;

create function public.generate_account_number()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  payload text;
begin
  -- gen_random_uuid() is cryptographically random; take 60 bits, reduce to 9 digits.
  payload := lpad(
    ((('x' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 15))::bit(60)::bigint) % 1000000000)::text,
    9, '0');
  return 'IB' || payload || public.luhn_check_digit(payload)::text;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- One row per person, ever. Never deleted: on account deletion it becomes a
-- tombstone (status = 'deleted') so the Account Number is never reused and
-- content they posted can show "Former member".
-- id equals auth.users.id at creation. No FK, so the auth user can be deleted
-- while this row remains.
create table public.accounts (
  id             uuid primary key,
  account_number text not null unique
                 check (public.is_valid_account_number(account_number)),
  role           public.app_role not null default 'seeker',
  status         public.account_status not null default 'active',
  created_at     timestamptz not null default now(),
  deleted_at     timestamptz
);

-- Editable profile details. Deleted on account deletion (personal data).
create table public.profiles (
  account_id   uuid primary key references public.accounts (id) on delete cascade,
  display_name text not null default '' check (length(display_name) <= 80),
  avatar_url   text,
  city         text check (length(city) <= 80),
  updated_at   timestamptz not null default now()
);

-- One row per app install / browser after login. No hardware or advertising IDs.
create table public.devices (
  id           uuid primary key default gen_random_uuid(),
  account_id   uuid not null references public.accounts (id) on delete cascade,
  platform     text not null check (platform in ('ios', 'android', 'web')),
  app_version  text,
  push_token   text,
  last_seen_at timestamptz not null default now(),
  created_at   timestamptz not null default now()
);
create index devices_account_id_idx on public.devices (account_id);

-- Security-relevant actions (role changes, recovery, login-method changes).
create table public.audit_log (
  id         bigint generated always as identity primary key,
  actor_id   uuid references public.accounts (id),
  target_id  uuid references public.accounts (id),
  action     text not null,
  details    jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index audit_log_target_idx on public.audit_log (target_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Immutability: account_number, id, created_at never change. role and status
-- change only through the security-definer functions below.
-- ---------------------------------------------------------------------------
create function public.accounts_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id <> old.id
     or new.account_number <> old.account_number
     or new.created_at <> old.created_at then
    raise exception 'account id, account_number and created_at are immutable';
  end if;
  if old.status = 'deleted' and new.status <> 'deleted' then
    raise exception 'a deleted account cannot be reactivated';
  end if;
  return new;
end;
$$;

create trigger accounts_guard
  before update on public.accounts
  for each row execute function public.accounts_guard();

-- ---------------------------------------------------------------------------
-- Role helpers (security definer so RLS policies don't recurse)
-- ---------------------------------------------------------------------------
create function public.current_role_of_user()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.accounts
  where id = auth.uid() and status = 'active';
$$;

create function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_role_of_user() in ('rm', 'moderator', 'admin'), false);
$$;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_role_of_user() = 'admin', false);
$$;

-- ---------------------------------------------------------------------------
-- Sign-up: create account + profile when Supabase Auth creates a user.
-- Everyone starts as 'seeker'; only admins grant staff roles.
-- ---------------------------------------------------------------------------
create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  attempt int := 0;
begin
  loop
    begin
      insert into public.accounts (id, account_number)
      values (new.id, public.generate_account_number());
      exit;
    exception when unique_violation then
      attempt := attempt + 1;
      if attempt >= 10 then raise; end if;
    end;
  end loop;

  insert into public.profiles (account_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''));

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ---------------------------------------------------------------------------
-- Admin: change a person's role (audited)
-- ---------------------------------------------------------------------------
create function public.admin_set_role(target uuid, new_role public.app_role)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_role public.app_role;
begin
  if not public.is_admin() then
    raise exception 'only admins can change roles' using errcode = '42501';
  end if;
  if target = auth.uid() then
    raise exception 'admins cannot change their own role' using errcode = '42501';
  end if;

  select role into old_role from public.accounts
  where id = target and status = 'active'
  for update;
  if not found then
    raise exception 'account not found or deleted';
  end if;

  update public.accounts set role = new_role where id = target;

  insert into public.audit_log (actor_id, target_id, action, details)
  values (auth.uid(), target, 'role_changed',
          jsonb_build_object('from', old_role, 'to', new_role));
end;
$$;

-- ---------------------------------------------------------------------------
-- Account deletion: erase personal data, keep the tombstone.
-- Called by a server-side function that also deletes the auth.users row.
-- ---------------------------------------------------------------------------
create function public.tombstone_account(target uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.profiles where account_id = target;
  delete from public.devices  where account_id = target;
  update public.accounts
     set status = 'deleted', deleted_at = now()
   where id = target and status = 'active';
  insert into public.audit_log (actor_id, target_id, action)
  values (target, target, 'account_deleted');
end;
$$;

revoke all on function public.tombstone_account(uuid) from public, anon, authenticated;
revoke all on function public.admin_set_role(uuid, public.app_role) from public, anon;
grant execute on function public.admin_set_role(uuid, public.app_role) to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.accounts  enable row level security;
alter table public.profiles  enable row level security;
alter table public.devices   enable row level security;
alter table public.audit_log enable row level security;

-- accounts: read your own; staff read all. No direct writes from clients.
create policy accounts_select_own on public.accounts
  for select to authenticated using (id = auth.uid());
create policy accounts_select_staff on public.accounts
  for select to authenticated using (public.is_staff());

-- profiles: any signed-in user can see profiles (names/photos in chats);
-- you edit only your own.
create policy profiles_select on public.profiles
  for select to authenticated using (true);
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (account_id = auth.uid()) with check (account_id = auth.uid());

-- devices: fully managed by the owner.
create policy devices_own on public.devices
  for all to authenticated
  using (account_id = auth.uid()) with check (account_id = auth.uid());

-- audit_log: admins read; writes only via security-definer functions.
create policy audit_log_select_admin on public.audit_log
  for select to authenticated using (public.is_admin());

-- Column-level: clients may only update these profile fields.
revoke update on public.profiles from authenticated;
grant update (display_name, avatar_url, city, updated_at) on public.profiles to authenticated;
revoke insert, update, delete on public.accounts from anon, authenticated;
revoke insert, update, delete on public.audit_log from anon, authenticated;
