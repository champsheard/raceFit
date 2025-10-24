import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { reload } from "firebase/auth";
import React, { useContext, useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { authStyles as styles } from "../../styles/authStyles";
import { theme } from "../../theme/colors";

export default function VerifyEmailScreen() {
  const { user, sendVerificationEmail, setIsLoading } = useContext(AuthContext);
  const [isCooldown, setIsCooldown] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === "dark" ? "dark" : "light"];

  const handleRefresh = async () => {
    if (isCooldown) return;

    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 3000);

    try {
      await reload(user);
      if (user.emailVerified) {
        setIsLoading(true);
        router.replace("/(tabs)");
        setIsLoading(false);
      } else {
        Alert.alert(
          "Still not verified",
          "Please verify your email, then press 'Refresh' again."
        );
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
      <LinearGradient
        colors={colors.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBg}
      >
        <View style={styles.innerContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Verify Your Email
          </Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: colors.textSecondary,
              lineHeight: 24,
              marginBottom: 48,
            }}
          >
            A verification link has been sent to your email address.  
            Please check your inbox (and spam folder) before continuing.
          </Text>


          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.button, { shadowColor: colors.shadow, marginBottom: 18 }]}
            onPress={() => sendVerificationEmail(user)}
          >
            <LinearGradient
              colors={colors.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Resend Verification Email</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.button,
              {
                shadowColor: colors.shadow,
                opacity: isCooldown ? 0.7 : 1,
              },
            ]}
            onPress={handleRefresh}
            disabled={isCooldown}
          >
            <LinearGradient
              colors={
                isCooldown
                  ? [colors.inputBorder, colors.inputBorder]
                  : colors.buttonGradient
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>I’ve Verified My Email</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Didn’t get the link?{" "}
            <Text style={[styles.footerLink, { color: colors.buttonGradient[0] }]}>
              Try again in a few minutes.
            </Text>
          </Text>
        </View>
      </LinearGradient>
  );
}
