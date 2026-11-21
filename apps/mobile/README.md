# infiniBliss app (iOS, Android, Web)

Expo (React Native) + Expo Router + Supabase. Placeholder branding from the Figma mockup.

## Screens
- `src/app/(auth)/sign-in.tsx`: mobile number + country picker, sends OTP
- `src/app/(auth)/verify.tsx`: 6-digit code (iOS/Android autofill), resend timer
- `src/app/index.tsx`: profile: Account Number, role, display name, sign out

## Run on your iPhone (Expo Go)
Needs Node.js 20+ on your computer.

```bash
cd apps/mobile
npm install
npx expo start
```

Scan the QR code with the iPhone camera; it opens in Expo Go.
Use a Supabase **test phone number** (Authentication → Phone) to log in without SMS.

## Config
Supabase URL and publishable key default to the dev project in `src/lib/supabase.ts`
(public values). Override with `EXPO_PUBLIC_SUPABASE_URL` /
`EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Never put secret keys in the app.

## Checks
```bash
npm run typecheck
```
