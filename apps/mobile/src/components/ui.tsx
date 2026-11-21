import type { ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/lib/theme";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.body}>{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function BrandMark() {
  return (
    <View style={styles.brand} accessibilityLabel="infiniBliss">
      <View style={[styles.bar, { height: 9 }]} />
      <View style={[styles.bar, { height: 18 }]} />
      <View style={[styles.bar, { height: 13 }]} />
    </View>
  );
}

export function Heading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <View style={styles.heading}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Field(props: TextInputProps) {
  return <TextInput placeholderTextColor={colors.muted} {...props} style={[styles.input, props.style]} />;
}

export function Button({
  label,
  onPress,
  disabled,
  loading,
  variant = "primary",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "ghost";
}) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        variant === "ghost" && styles.ghost,
        isDisabled && styles.disabled,
        pressed && !isDisabled && { opacity: 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "ghost" ? colors.ink : "#fff"} />
      ) : (
        <Text style={[styles.buttonText, variant === "ghost" && { color: colors.ink }]}>{label}</Text>
      )}
    </Pressable>
  );
}

export function ErrorText({ children }: { children?: string | null }) {
  return children ? <Text style={styles.error}>{children}</Text> : null;
}

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  flex: { flex: 1 },
  body: { flex: 1, padding: 24, gap: 16, maxWidth: 480, width: "100%", alignSelf: "center" },
  brand: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.ink,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  bar: { width: 3, borderRadius: 4, backgroundColor: "#fff" },
  heading: { gap: 6, marginTop: 8 },
  eyebrow: { color: colors.indigo, fontWeight: "700", fontSize: 13, letterSpacing: 0.4 },
  title: { color: colors.ink, fontSize: 28, fontWeight: "700" },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 21 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    color: colors.ink,
  },
  button: {
    backgroundColor: colors.ink,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  ghost: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.line },
  disabled: { opacity: 0.4 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  error: { color: colors.danger, fontSize: 14 },
});
