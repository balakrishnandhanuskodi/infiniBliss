import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

import { Button, ErrorText, Field, Heading, Screen } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { colors } from "@/lib/theme";

const RESEND_SECONDS = 30;

export default function Verify() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wait, setWait] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  async function verify(token: string) {
    if (!phone) return;
    setError(null);
    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
    setVerifying(false);
    // On success the auth listener updates the session and the root layout
    // switches to the signed-in screens.
    if (error) setError(error.message);
  }

  async function resend() {
    if (!phone) return;
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) setError(error.message);
    else setWait(RESEND_SECONDS);
  }

  return (
    <Screen>
      <Heading title="Enter code" subtitle={`We sent a 6-digit code to ${phone ?? "your phone"}.`} />
      <Field
        value={code}
        onChangeText={(v) => {
          const digits = v.replace(/\D/g, "").slice(0, 6);
          setCode(digits);
          if (digits.length === 6) verify(digits);
        }}
        placeholder="••••••"
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        autoFocus
        maxLength={6}
        style={s.code}
      />
      <ErrorText>{error}</ErrorText>
      <Button label="Verify" onPress={() => verify(code)} disabled={code.length !== 6} loading={verifying} />
      <Button
        label={wait > 0 ? `Resend code in ${wait}s` : "Resend code"}
        variant="ghost"
        onPress={resend}
        disabled={wait > 0}
      />
      <Text style={s.change} onPress={() => router.back()}>
        Change number
      </Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  code: { fontSize: 28, letterSpacing: 10, textAlign: "center" },
  change: { color: colors.indigo, fontWeight: "600", textAlign: "center", paddingVertical: 8 },
});
