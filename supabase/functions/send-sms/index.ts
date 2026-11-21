// Supabase "Send SMS" auth hook -> MSG91.
// Supabase Auth generates the OTP and calls this function to deliver it.
// Design: docs/identity-and-accounts.md (section "OTP delivery").
//
// Required secrets (Edge Functions -> Secrets):
//   SEND_SMS_HOOK_SECRET  from Authentication -> Hooks (format "v1,whsec_...")
//   MSG91_AUTH_KEY        MSG91 auth key
//   MSG91_TEMPLATE_ID     MSG91 SendOTP template ID (sender INFTSM, DLT-linked)
// Optional:
//   ALLOWED_COUNTRY_CODES comma-separated dial codes allowed to receive OTP,
//                         e.g. "91,1,44,971,65,61". Default "91".
//   OTP_EXPIRY_MINUTES    passed to MSG91 for its own records. Default "5".

import { Webhook } from "npm:standardwebhooks@1.0.0";

type HookPayload = {
  user: { id: string; phone: string };
  sms: { otp: string };
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const hookError = (status: number, message: string) =>
  json(status, { error: { http_code: status, message } });

function dialCodeOf(phone: string, allowed: string[]): string | null {
  // Longest match first so "971" wins over "9".
  return [...allowed].sort((a, b) => b.length - a.length).find((c) => phone.startsWith(c)) ?? null;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return hookError(405, "Method not allowed");

  const secret = Deno.env.get("SEND_SMS_HOOK_SECRET");
  const authKey = Deno.env.get("MSG91_AUTH_KEY");
  const templateId = Deno.env.get("MSG91_TEMPLATE_ID");
  if (!secret || !authKey || !templateId) {
    console.error("send-sms: missing required secrets");
    return hookError(500, "SMS service is not configured");
  }

  // 1. Verify the request really comes from Supabase Auth.
  const raw = await req.text();
  let payload: HookPayload;
  try {
    const wh = new Webhook(secret.replace("v1,whsec_", ""));
    payload = wh.verify(raw, Object.fromEntries(req.headers)) as HookPayload;
  } catch {
    return hookError(401, "Invalid signature");
  }

  // Supabase stores phones as digits with country code, no "+".
  const phone = payload.user.phone.replace(/\D/g, "");
  const otp = payload.sms.otp;

  // 2. Country allowlist (SMS-pumping fraud protection).
  const allowed = (Deno.env.get("ALLOWED_COUNTRY_CODES") ?? "91")
    .split(",").map((c) => c.trim()).filter(Boolean);
  if (!dialCodeOf(phone, allowed)) {
    return hookError(400, "Phone login is not available in this country yet. Please use email.");
  }

  // 3. Deliver via MSG91 SendOTP with our own code.
  const url = new URL("https://control.msg91.com/api/v5/otp");
  url.searchParams.set("template_id", templateId);
  url.searchParams.set("mobile", phone);
  url.searchParams.set("otp", otp);
  url.searchParams.set("otp_expiry", Deno.env.get("OTP_EXPIRY_MINUTES") ?? "5");

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { authkey: authKey, "Content-Type": "application/json" },
      body: "{}",
    });
  } catch (e) {
    console.error("send-sms: MSG91 unreachable", e);
    return hookError(502, "Could not send the code. Please try again.");
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.type === "error") {
    // Never log the OTP or full phone number.
    console.error("send-sms: MSG91 error", res.status, body?.message, "phone ****" + phone.slice(-4));
    return hookError(502, "Could not send the code. Please try again.");
  }

  return json(200, {});
});
