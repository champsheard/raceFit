import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import React, { useContext } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import { TeamProvider } from "../context/TeamProvider";
import { authStyles as styles } from "../styles/authStyles";
import { theme } from "../theme/colors";
import VerifyEmailScreen from "./auth/verifyEmail";
export default function App() {
  return (
    <AuthProvider>
        <TeamProvider>
      <SafeAreaProvider style={{ flex: 1 }}>
        <RootLayout />
      </SafeAreaProvider>
      </TeamProvider>
    </AuthProvider>
  );
}

function RootLayout() {
  const { user, isUserAuthenticated, isLoading, setIsLoading } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === "dark" ? "dark" : "light"];

  if (isLoading) {
    return (
      <LinearGradient
        colors={colors.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBg}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.buttonGradient[0]} />
        </View>
      </LinearGradient >

    );
  }
  if (user && !user.emailVerified) {
    return <VerifyEmailScreen />;
  }
  return (
    <Stack>
      <Stack.Protected guard={isUserAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isUserAuthenticated}>
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
