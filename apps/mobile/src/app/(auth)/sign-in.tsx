import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { BrandMark, Button, ErrorText, Field, Heading, Screen } from "@/components/ui";
import { COUNTRIES, DEFAULT_COUNTRY, toE164, type Country } from "@/lib/countries";
import { supabase } from "@/lib/supabase";
import { colors } from "@/lib/theme";

export default function SignIn() {
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [picking, setPicking] = useState(false);
  const [local, setLocal] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const digits = local.replace(/\D/g, "");
  const valid = digits.length >= 6 && digits.length <= 14;

  async function sendCode() {
    setError(null);
    setSending(true);
    const phone = toE164(country, local);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setSending(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push({ pathname: "/verify", params: { phone } });
  }

  return (
    <Screen>
      <BrandMark />
      <Heading
        eyebrow="infiniBliss"
        title="Welcome"
        subtitle="Enter your mobile number. We'll send you a one-time code."
      />

      <View style={s.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Country: ${country.name}`}
          onPress={() => setPicking(true)}
          style={s.country}
        >
          <Text style={s.countryText}>
            {country.flag} +{country.dial}
          </Text>
        </Pressable>
        <Field
          style={{ flex: 1, minWidth: 0 }}
          value={local}
          onChangeText={setLocal}
          placeholder="Mobile number"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          autoFocus
          maxLength={18}
        />
      </View>

      <ErrorText>{error}</ErrorText>
      <Button label="Send code" onPress={sendCode} disabled={!valid} loading={sending} />

      <Text style={s.note}>
        By continuing you agree to the Terms and Privacy Policy. Your number is never shown to other members.
      </Text>

      <Modal visible={picking} animationType="slide" transparent onRequestClose={() => setPicking(false)}>
        <View style={s.sheetBackdrop}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Select country</Text>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(c) => c.iso}
              renderItem={({ item }) => (
                <Pressable
                  style={s.option}
                  onPress={() => {
                    setCountry(item);
                    setPicking(false);
                  }}
                >
                  <Text style={s.optionText}>
                    {item.flag}  {item.name}
                  </Text>
                  <Text style={s.optionDial}>+{item.dial}</Text>
                </Pressable>
              )}
            />
            <Button label="Cancel" variant="ghost" onPress={() => setPicking(false)} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  country: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  countryText: { fontSize: 17, color: colors.ink },
  note: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: "auto" },
  sheetBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(17,18,20,0.35)" },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,
    maxHeight: "70%",
  },
  sheetTitle: { fontSize: 18, fontWeight: "700", color: colors.ink },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  optionText: { fontSize: 16, color: colors.ink },
  optionDial: { fontSize: 16, color: colors.muted },
});
