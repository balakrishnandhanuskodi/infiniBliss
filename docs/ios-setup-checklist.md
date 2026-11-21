# iOS setup checklist

App stack: Expo (React Native) + EAS (Expo's cloud build service) + Supabase.
**No Mac is required**: EAS builds and signs the iOS app in the cloud.

## Stage 1: Develop on your iPhone (no Apple Developer account needed)

| Item | Cost | Status |
|---|---|---|
| iPhone with **Expo Go** app (from App Store) | Free | To install |
| **Expo account** (expo.dev), ideally an organization account "infinitheism" | Free | To create |
| Supabase project `dspenyxjhdrljccrsord` | Free (dev) | Done |
| Supabase: enable **Phone** auth provider + test phone numbers with fixed OTP | — | To do |
| MSG91 SendOTP template (sender INFTSM, DLT-linked) | Per SMS | In progress |
| GitHub repo | — | Done |

In Stage 1 you open the app in Expo Go by scanning a QR code / opening a link.

## Stage 2: TestFlight and App Store (needs Apple Developer Program)

| Item | Cost | Notes |
|---|---|---|
| **Apple Developer Program**, enrolled as an **Organization** | USD 99 / year | Needs a **D-U-N-S number** for the legal entity (free from Apple's D-U-N-S lookup; can take 1–2 weeks). Start early. Individual enrollment is faster but shows a personal name as the seller. |
| **Bundle ID**, e.g. `com.infinitheism.infinibliss` | — | Permanent once published; decide carefully. |
| **App Store Connect** app record | — | Name "infiniBliss" must be available. |
| **App Store Connect API key** for EAS (build signing + submit) | — | Entered into EAS by the owner, never shared in chat. |
| **TestFlight** testers | Free | Up to 10,000 external testers. |
| **APNs key** (push notifications) | — | Created in Apple Developer portal, uploaded to EAS/Supabase. |
| EAS plan | Free tier to start | Paid plan only if build queue / volume needs it. |

## Stage 3: Required for App Store review

| Item | Notes |
|---|---|
| **Website / domain** (e.g. `infinibliss.app` or a subdomain of the organization's site) | Hosts the pages below and web app. |
| **Privacy policy URL** | Mandatory. Covers DPDP Act + GDPR for international users. |
| **Support URL** | Mandatory. |
| **Account deletion web page** | Required by Google Play; good practice for Apple. In-app deletion is mandatory for both. |
| **Reviewer login** | Test phone number with fixed OTP in Supabase. |
| **App privacy label** | Phone, email, name, photos, User ID (Account Number), messages: linked to identity, not used for tracking. |
| **Screenshots + description + age rating** | 6.7" and 6.5" iPhone sizes at minimum. |
| **Custom email sender (SMTP)** for email OTP | Supabase's built-in email is heavily rate-limited; use MSG91 Email, Amazon SES, or similar. |
| **Supabase Pro** for production | Backups, no auto-pause. Separate prod project. |

## Later (not needed for login MVP)

- Voice / video calls service (e.g. LiveKit or Agora) + Apple CallKit / VoIP push.
- Media storage limits and CDN.
- Sign in with Apple (only required if Google sign-in is added).
