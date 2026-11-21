import { Redirect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { BrandMark, Button, ErrorText, Field, Heading, Screen } from "@/components/ui";
import { formatAccountNumber } from "@/lib/accountNumber";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { colors } from "@/lib/theme";

type Me = {
  account_number: string;
  role: "seeker" | "rm" | "moderator" | "admin";
  display_name: string;
};

const ROLE_LABEL: Record<Me["role"], string> = {
  seeker: "Seeker",
  rm: "Relationship Manager",
  moderator: "Moderator",
  admin: "Admin",
};

export default function Profile() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [me, setMe] = useState<Me | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    const [{ data: acct, error: e1 }, { data: prof, error: e2 }] = await Promise.all([
      supabase.from("accounts").select("account_number, role").eq("id", userId).single(),
      supabase.from("profiles").select("display_name").eq("account_id", userId).single(),
    ]);
    if (e1 || e2 || !acct) {
      setError((e1 ?? e2)?.message ?? "Could not load your account.");
      return;
    }
    setMe({ ...acct, display_name: prof?.display_name ?? "" });
    setName(prof?.display_name ?? "");
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveName() {
    if (!userId) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: name.trim(), updated_at: new Date().toISOString() })
      .eq("account_id", userId);
    setSaving(false);
    if (error) setError(error.message);
    else setMe((m) => (m ? { ...m, display_name: name.trim() } : m));
  }

  if (!session) return <Redirect href="/sign-in" />;

  if (!me) {
    return (
      <Screen>
        {error ? <ErrorText>{error}</ErrorText> : <ActivityIndicator color={colors.ink} />}
        {error ? <Button label="Sign out" variant="ghost" onPress={() => supabase.auth.signOut()} /> : null}
      </Screen>
    );
  }

  return (
    <Screen>
      <BrandMark />
      <Heading eyebrow="Your space" title={me.display_name || "Welcome"} />

      <View style={s.card}>
        <Text style={s.label}>Account Number</Text>
        <Text style={s.acct} selectable>
          {formatAccountNumber(me.account_number)}
        </Text>
        <Text style={s.hint}>This number stays the same even if you change your mobile or email.</Text>
        <View style={s.pill}>
          <Text style={s.pillText}>{ROLE_LABEL[me.role]}</Text>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={s.label}>Display name</Text>
        <Field value={name} onChangeText={setName} placeholder="Your name" maxLength={80} />
      </View>
      <ErrorText>{error}</ErrorText>
      <Button
        label="Save"
        onPress={saveName}
        loading={saving}
        disabled={name.trim() === me.display_name}
      />

      <Text style={s.phone}>Signed in as {session?.user.phone ? `+${session.user.phone}` : session?.user.email}</Text>
      <Button label="Sign out" variant="ghost" onPress={() => supabase.auth.signOut()} />
    </Screen>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.line,
  },
  label: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  acct: { color: colors.ink, fontSize: 26, fontWeight: "700", letterSpacing: 1 },
  hint: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  pill: {
    alignSelf: "flex-start",
    marginTop: 6,
    backgroundColor: colors.indigoSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillText: { color: colors.indigo, fontWeight: "700", fontSize: 12 },
  phone: { color: colors.muted, fontSize: 13, marginTop: "auto", textAlign: "center" },
});
