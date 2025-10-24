import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { authStyles as styles } from "../../styles/authStyles";
import { theme } from "../../theme/colors";

export default function LoginUser() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === "dark" ? "dark" : "light"];

  const { login } = useContext(AuthContext); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  // --- Validation ---
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  useEffect(() => {
    const newErrors = {};
    if (email && !isValidEmail(email)) newErrors.email = true;
    if (password && !isStrongPassword(password)) newErrors.password = true;
    setErrors(newErrors);
  }, [email, password]);

  return (
      <LinearGradient
        colors={colors.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBg}
      >
        <View style={styles.innerContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Log In</Text>

          <View style={styles.inputWrapper}>
            {/* EMAIL */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.email ? colors.error : colors.inputBorder,
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="name@example.com"
              placeholderTextColor={colors.placeholder}
            />

            {/* PASSWORD */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.password ? colors.error : colors.inputBorder,
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                },
              ]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••••••"
              placeholderTextColor={colors.placeholder}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.button, { shadowColor: colors.shadow }]}
            onPress={() => login(email, password, errors)} 
          >
            <LinearGradient
              colors={colors.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/auth/register")}
            style={{ marginTop: 24, alignItems: "center" }}
          >
            <Text style={{ color: colors.textSecondary }}>
              Don’t have an account?{" "}
              <Text style={{ color: colors.buttonGradient[0], fontWeight: "700" }}>
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
  );
}

