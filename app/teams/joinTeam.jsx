import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, useColorScheme } from "react-native";
import GradientButton from "../../components/GradientButton";
import { AuthContext } from "../../context/AuthContext";
import { TeamContext } from "../../context/TeamProvider";
import { theme } from "../../theme/colors";

export default function JoinTeamPage() {
  const router = useRouter();
  const { joinTeam } = useContext(TeamContext);
  const { user } = useContext(AuthContext);
  const systemTheme = useColorScheme();
  const colors = theme[systemTheme ?? "light"];

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState(false);

  const handleJoin = async () => {
    setError("");
    
    if (!user) {
      setError("You must be logged in to join a team.");
      return;
    }

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError("Please enter a join code.");
      return;
    }

    if (!/^\d{8}$/.test(trimmedCode)) {
      setError("Join code must be exactly 8 digits.");
      return;
    }

    setLoading(true);
    const result = await joinTeam(trimmedCode);
    setLoading(false);

    if (result.success) {
      setCode("");
      alert("Successfully joined the team!");
      router.back();
    } else {
      setError(result.error || "Could not join team. Please check your code and try again.");
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 60,
    },
    headerArea: {
      marginBottom: 48,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 40,
      fontWeight: "900",
      color: colors.text,
      marginBottom: 6,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "400",
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "#2563EB20",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 40,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    inputField: {
      paddingVertical: 14,
      paddingHorizontal: 0,
      fontSize: 28,
      fontWeight: "600",
      color: colors.text,
      borderBottomWidth: 2,
      borderBottomColor: focusedInput ? "#2563EB" : colors.inputBorder,
      letterSpacing: 8,
      textAlign: "center",
    },
    formSection: {
      marginBottom: 36,
    },
    infoText: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 32,
      fontWeight: "400",
    },
    errorContainer: {
      backgroundColor: "#DC262620",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 28,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderLeftWidth: 4,
      borderLeftColor: "#DC2626",
    },
    errorText: {
      color: "#DC2626",
      fontSize: 13,
      fontWeight: "500",
      flex: 1,
      lineHeight: 18,
    },
    digitCounter: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
      marginTop: 10,
      textAlign: "center",
    },
    scrollContent: {
      paddingBottom: 50,
    },
    actionButton: {
      marginTop: 24,
    },
  });

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : undefined} 
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient colors={colors.backgroundGradient} style={{ flex: 1 }}>
          <View style={dynamicStyles.container}>
            {/* Header */}
            <View style={dynamicStyles.headerArea}>
              <TouchableOpacity 
                onPress={() => router.back()}
                style={dynamicStyles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="chevron-back" size={32} color={colors.text} />
              </TouchableOpacity>
              <Text style={dynamicStyles.title}>Join Team</Text>
              <Text style={dynamicStyles.subtitle}>Access code required</Text>
            </View>

            <ScrollView 
              contentContainerStyle={dynamicStyles.scrollContent} 
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Icon */}
              <View style={dynamicStyles.iconCircle}>
                <Ionicons name="key" size={40} color="#2563EB" />
              </View>

              {/* Info Text */}
              <Text style={dynamicStyles.infoText}>
                Get an 8-digit team code from your team leader to join an existing team.
              </Text>

              {/* Error Display */}
              {error ? (
                <View style={dynamicStyles.errorContainer}>
                  <Ionicons name="alert-circle" size={18} color="#DC2626" />
                  <Text style={dynamicStyles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Code Input */}
              <View style={dynamicStyles.formSection}>
                <Text style={dynamicStyles.inputLabel}>Team Code</Text>
                <TextInput
                  style={dynamicStyles.inputField}
                  value={code}
                  onChangeText={setCode}
                  placeholder="00000000"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="numeric"
                  maxLength={8}
                  onFocus={() => setFocusedInput(true)}
                  onBlur={() => setFocusedInput(false)}
                />
                {code.length > 0 && (
                  <Text style={dynamicStyles.digitCounter}>
                    {code.length} of 8 digits
                  </Text>
                )}
              </View>

              {/* Join Button */}
              <View style={dynamicStyles.actionButton}>
                <GradientButton 
                  title={loading ? "Joining..." : "Join Team"} 
                  onPress={handleJoin}
                  disabled={loading || !code.trim() || code.length !== 8}
                />
              </View>
            </ScrollView>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
