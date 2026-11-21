// Countries offered on the phone login screen. Keep in sync with the
// ALLOWED_COUNTRY_CODES secret of the send-sms hook (supabase/functions/send-sms).
export type Country = { iso: string; name: string; dial: string; flag: string };

export const COUNTRIES: Country[] = [
  { iso: "IN", name: "India", dial: "91", flag: "🇮🇳" },
  { iso: "US", name: "United States", dial: "1", flag: "🇺🇸" },
  { iso: "GB", name: "United Kingdom", dial: "44", flag: "🇬🇧" },
  { iso: "AE", name: "United Arab Emirates", dial: "971", flag: "🇦🇪" },
  { iso: "SG", name: "Singapore", dial: "65", flag: "🇸🇬" },
  { iso: "AU", name: "Australia", dial: "61", flag: "🇦🇺" },
  { iso: "CA", name: "Canada", dial: "1", flag: "🇨🇦" },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

/** E.164 without spaces, e.g. "+919876543210". */
export function toE164(country: Country, local: string): string {
  return `+${country.dial}${local.replace(/\D/g, "").replace(/^0+/, "")}`;
}
