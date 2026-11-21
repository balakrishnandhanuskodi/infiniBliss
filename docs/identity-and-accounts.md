# Identity & Accounts — Design

Status: **Agreed in principle** (open items at the bottom).
Platforms: iOS, Android, Web — built with Expo (React Native + web) on Supabase.

## 1. Three layers of identity

| Layer | What it is | Visible to | Changes? |
|---|---|---|---|
| **Internal ID** | UUID created by Supabase Auth (`auth.users.id`). Every table references this. | Nobody (database only) | Never |
| **Account Number** | Public, human-readable number assigned once at sign-up. | User, RMs, Moderators, Admins, support | Never |
| **Login methods** | Verified mobile numbers, emails, and later Google / Apple / passkeys, linked to the account. | User (own), Admin | Any time, after verification |

Changing a mobile number or email only changes a login method. The account,
Account Number, history, circles and role stay the same.

## 2. Account Number

Format: `IB` + 10 digits, displayed `IB 4821 593 067`, stored `IB4821593067`.

- First 9 digits **random** (not sequential), 10th digit a **Luhn check digit**.
- Contains **no personal data** (no phone digits, birth date, city code).
- Digits only: easy to dictate over the phone, numeric keypad friendly.
- Generated server-side, unique constraint, retry on collision.
- **Never reused.** On account deletion it is retired (kept with no personal data).
- **Not a credential.** Knowing an Account Number never logs anyone in, and
  support must verify the person (OTP to a linked login method) before acting.

## 3. Login methods (the "freedom to change" part)

A person can hold several verified login methods at once (e.g. two mobiles + one
email). Rules:

1. **At least one** verified login method must remain at all times.
2. **Add** a new mobile/email → OTP sent to it → linked only after the code is entered.
3. **Remove or replace** a method → the person must first prove it is them with a
   *different* method they still hold, or a recent login (re-verification).
4. Every add/remove is **notified** to all remaining methods ("Your mobile was
   changed. Not you? …").
5. A newly added method gets a short **cooling-off period** (e.g. 24 h) before it
   can be used to remove other methods. Limits SIM-swap / account takeover damage.
6. **Lost everything** (old phone and email both gone) → assisted recovery by an
   Admin: identity check, then Admin links a new method. Logged in the audit trail.
7. A mobile/email can belong to **only one account** at a time.

Profile details (name, photo, city, etc.) are separate from login methods and can
be edited freely without verification.

## 4. Devices (instead of device / advertising IDs)

We never use IDFA, Android Advertising ID, IMEI or hardware IDs.
Each app install instead gets:

- a **session** (Supabase refresh token) after login, and
- a **device record** we create: random ID, platform, app version, push token,
  last-seen time.

The user sees "Logged-in devices" in settings and can sign out any of them.
Deleting the account or signing out removes the device record and push token.

## 5. History survives login-method and device changes

All content belongs to the **Internal ID**, never to a mobile number, email or device.

- Messages, circle memberships, media, voice notes, documents, call logs and
  notifications are stored **on the server** (Supabase Postgres + Storage),
  keyed by the Internal ID.
- The phone only keeps a **cache** for speed and offline viewing.
- Changing mobile/email → nothing moves; the account is the same.
- New phone (same or new number) → log in with any linked method → history
  downloads from the server. No manual backup/restore.
- Other members are unaffected: they see the same name and photo. Mobile numbers
  and emails are **never shown** to other users.
- **Calls:** a call log (who, when, duration, circle) is kept. Audio/video is not
  recorded unless a recording feature is added later, with clear consent.
- **Encryption:** encrypted in transit (TLS) and at rest, but **not end-to-end**,
  so Moderators can review reported content and history restores without key
  backups. (Decision to confirm; E2E would need per-device keys + key backup and
  limits moderation.)
- **Deletion** (not number change) is the only event that removes history: the
  user's personal data is erased; messages they sent in circles show as
  "Deleted user" (or are removed — retention policy to decide).

## 6. Roles

`seeker` (end user), `rm` (relationship manager), `moderator`, `admin`.
Stored on the account, enforced by database Row Level Security, not just in the UI.
One primary role per account initially; can extend to multiple later.

## 7. App-store & compliance requirements

- **Account deletion** in-app (Apple 5.1.1(v), Google Play) plus a web deletion page.
  Personal data erased; Account Number retired; legally required records retained
  and stated in the privacy policy.
- **Sign in with Apple** required if any third-party social login (e.g. Google) is offered.
- Apple "Hide My Email" relay addresses are valid emails; identity never depends on email.
- **Reviewer test login:** a test mobile number with a fixed OTP.
- **Privacy label / Data Safety:** Account Number declared as "User ID", app
  functionality, linked to identity, not used for tracking.
- **India:** SMS OTP needs TRAI DLT registration (start early; WhatsApp OTP as
  alternative). DPDP Act 2023 consent at sign-up.

## 8. Open items

- Primary login method (mobile OTP first? email backup?) and supported countries.
- Supabase project: existing or new, and region.
- Who creates RM / Moderator / Admin accounts; do Seekers self-register or get invited by RMs?
- End-to-end encryption vs server-side encryption (recommended: server-side, for moderation).
- What happens to a deleted user's messages in circles: anonymise as "Deleted user" or remove.
