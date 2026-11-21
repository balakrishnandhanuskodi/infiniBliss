-- Local smoke test for the identity migration (plain Postgres, no Supabase).
-- Run: supabase/tests/run-local.sh
\set ON_ERROR_STOP on

-- Users sign up -> account + profile created with valid Account Numbers
insert into auth.users (id, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', '{"display_name":"Admin A"}'),
  ('00000000-0000-0000-0000-00000000000b', '{"display_name":"Seeker B"}'),
  ('00000000-0000-0000-0000-00000000000c', '{}');
select count(*) = 3 as three_accounts,
       bool_and(public.is_valid_account_number(account_number)) as all_valid,
       bool_and(role = 'seeker') as all_seekers
from public.accounts;

-- Luhn catches a single-digit typo and a swap
do $$
declare a text; bad text; d int;
begin
  for i in 1..500 loop
    a := public.generate_account_number();
    assert public.is_valid_account_number(a), 'generated invalid ' || a;
    d := substr(a, 7, 1)::int;
    bad := overlay(a placing ((d + 1) % 10)::text from 7 for 1);
    assert not public.is_valid_account_number(bad), 'typo not caught ' || bad;
  end loop;
end $$;
select 'luhn ok';

-- Bootstrap first admin (done once manually by the project owner)
update public.accounts set role = 'admin' where id = '00000000-0000-0000-0000-00000000000a';

-- Account number is immutable
do $$ begin
  update public.accounts set account_number = 'IB0000000000' where id = '00000000-0000-0000-0000-00000000000b';
  raise exception 'should have failed';
exception when others then
  assert sqlerrm like '%immutable%', sqlerrm;
end $$;
select 'immutable ok';

-- As seeker B
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);
select count(*) = 1 as seeker_sees_only_own_account from public.accounts;
select count(*) = 3 as seeker_sees_profiles from public.profiles;
update public.profiles set display_name = 'Seeker Bee' where account_id = '00000000-0000-0000-0000-00000000000b';
update public.profiles set display_name = 'hacked' where account_id = '00000000-0000-0000-0000-00000000000a';
do $$ begin
  update public.accounts set role = 'admin' where id = auth.uid();
  raise exception 'should have failed';
exception when insufficient_privilege then null; end $$;
do $$ begin
  perform public.admin_set_role('00000000-0000-0000-0000-00000000000c', 'rm');
  raise exception 'should have failed';
exception when insufficient_privilege then null; end $$;
select count(*) = 0 as seeker_cannot_read_audit from public.audit_log;
insert into public.devices (account_id, platform, app_version) values (auth.uid(), 'ios', '0.1.0');
select 'seeker checks ok';

-- As admin A
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
select count(*) = 3 as admin_sees_all_accounts from public.accounts;
select public.admin_set_role('00000000-0000-0000-0000-00000000000c', 'rm');
select count(*) = 0 as admin_cannot_see_others_devices from public.devices;
reset role;

select display_name from public.profiles order by account_id;
select role from public.accounts where id = '00000000-0000-0000-0000-00000000000c';

-- Deletion: profile/devices erased, tombstone kept, number not reused
select public.tombstone_account('00000000-0000-0000-0000-00000000000b');
select status, deleted_at is not null as has_deleted_at, account_number is not null as number_retained
from public.accounts where id = '00000000-0000-0000-0000-00000000000b';
select count(*) = 0 as profile_erased from public.profiles where account_id = '00000000-0000-0000-0000-00000000000b';
select count(*) = 0 as devices_erased from public.devices where account_id = '00000000-0000-0000-0000-00000000000b';
do $$ begin
  update public.accounts set status = 'active' where id = '00000000-0000-0000-0000-00000000000b';
  raise exception 'should have failed';
exception when others then assert sqlerrm like '%reactivated%', sqlerrm; end $$;
select action from public.audit_log order by id;
