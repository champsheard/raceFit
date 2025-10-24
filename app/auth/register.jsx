import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AuthContext } from "../../context/AuthContext";
import { authStyles as styles } from "../../styles/authStyles";
import { theme } from "../../theme/colors";


export default function Register() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === "dark" ? "dark" : "light"];

  const { registerUser } = useContext(AuthContext)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [step, setStep] = useState(1);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);
  const handleConfirm = (date) => {
    setSelectedDate(date);
    hidePicker();
  };

  // --- Validation ---
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  const isOldEnough = (date) => {
    const today = new Date();
    const ageDiff = today.getFullYear() - date.getFullYear();
    if (
      ageDiff > 13 ||
      (ageDiff === 13 &&
        (today.getMonth() > date.getMonth() ||
          (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate())))
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const newErrors = {};
    if (email && !isValidEmail(email)) newErrors.email = true;
    if (password && !isStrongPassword(password)) newErrors.password = true;
    if (name && name.trim().length < 2) newErrors.name = true;
    if (selectedDate && !isOldEnough(selectedDate)) newErrors.date = true;
    setErrors(newErrors);
  }, [email, password, name, selectedDate]);


  // --- STEP 1 ---
  if (step === 1) {
    return (
        <LinearGradient
          colors={colors.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBg}
        >
          <View style={styles.innerContainer}>
            <Text style={[styles.title, { color: colors.text }]}>Create Your Account</Text>

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
              onPress={() => {
                if (!email.trim() || !password.trim()) {
                  Alert.alert("Missing Fields", "Please fill out both email and password.");
                  return;
                }
                if (Object.keys(errors).length > 0) {
                  Alert.alert("Invalid Fields", "Please correct the highlighted fields.");
                  return;
                }
                setStep(2);
              }}
            >
              <LinearGradient
                colors={colors.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/auth/login")}
              style={{ marginTop: 24, alignItems: "center" }}
            >
              <Text style={{ color: colors.textSecondary }}>
                Already have an account?{" "}
                <Text style={{ color: colors.buttonGradient[0], fontWeight: "700" }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
    );
  }

  // --- STEP 2 ---
  return (
      <LinearGradient
        colors={colors.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBg}
      >
        <View style={styles.innerContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Personal Information</Text>

          <View style={styles.inputWrapper}>
            {/* NAME */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.name ? colors.error : colors.inputBorder,
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Bob da Builder"
              placeholderTextColor={colors.placeholder}
            />

            {/* BIRTHDAY */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Birthday</Text>
            <Button
              title={selectedDate ? selectedDate.toLocaleDateString() : "Pick a Date"}
              onPress={showPicker}
            />
            <DateTimePickerModal
              isVisible={isPickerVisible}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onConfirm={handleConfirm}
              onCancel={hidePicker}
              maximumDate={new Date()}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.button, { shadowColor: colors.shadow }]}
            onPress={() => {
              // --- Validate fields ---
              const newErrors = {};
              if (!name.trim()) newErrors.name = true;
              if (!selectedDate) newErrors.date = true;
              if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                Alert.alert("Invalid Fields", "Please fill out all fields correctly.");
                return;
              }

              registerUser(email, password, name, selectedDate, newErrors)
                .then(() => {
                  router.push("/auth/login"); 
                })
                .catch((err) => {
                  console.log("Registration failed:", err);
                });
            }}
          >
            <LinearGradient
              colors={colors.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Create Account</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginTop: 24, alignItems: "center" }}
          >
            <Text style={{ color: colors.textSecondary }}>
              <Ionicons name="arrow-back" size={16} color="black" />
              <Text style={{ color: colors.buttonGradient[0], fontWeight: "700" }}>Go Back</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
  );
}

