import { Ionicons } from "@expo/vector-icons"; // <-- Import icon library
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, useColorScheme } from "react-native";
import FormInput from "../../components/FormInput";
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

  const handleJoin = async () => {
    if (!user) return alert("You must be logged in to join a team.");
    if (!/^\d{8}$/.test(code.trim())) return alert("Please enter a valid 8-digit join code.");

    setLoading(true);
    const result = await joinTeam(code.trim());
    setLoading(false);

    if (result.success) {
      alert("Successfully joined the team!");
      router.back();
    } else {
      alert(result.error || "Could not join team.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : undefined} 
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient colors={colors.backgroundGradient} style={{ flex: 1, paddingHorizontal: 20, paddingTop: 60 }}>
          
          {/* Back Button with Icon */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={{ marginBottom: 20, width: 40, height: 40, justifyContent: "center", alignItems: "center" }}
          >
            <Ionicons name="arrow-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
            <Text style={{ fontSize: 34, fontWeight: "700", color: colors.textPrimary, marginBottom: 30 }}>Join a Team</Text>
            <FormInput label="Join Code" value={code} onChangeText={setCode} placeholder="Enter 8-digit code" keyboardType="numeric" />
            <GradientButton title={loading ? "Joining..." : "Join Team"} onPress={handleJoin} disabled={loading} />
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
