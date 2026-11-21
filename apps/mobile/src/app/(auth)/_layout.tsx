import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/lib/auth";

import { colors } from "@/lib/theme";

export default function AuthLayout() {
  const { session } = useAuth();
  if (session) return <Redirect href="/" />;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}>
      {/* First screen = where signed-out users land. */}
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="verify" />
    </Stack>
  );
}
