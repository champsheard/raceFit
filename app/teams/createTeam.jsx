import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableWithoutFeedback, useColorScheme } from "react-native";
import FormInput from "../../components/FormInput";
import GradientButton from "../../components/GradientButton";
import { TeamContext } from "../../context/TeamProvider";
import { theme } from "../../theme/colors";

export default function CreateTeamPage() {
  const router = useRouter();
  const { createTeam } = useContext(TeamContext);
  const systemTheme = useColorScheme();
  const colors = theme[systemTheme ?? "light"];

  const [name, setName] = useState("");
  const [resetInterval, setResetInterval] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return alert("Please enter a team name.");
    const interval = Number(resetInterval);
    if (resetInterval && isNaN(interval)) return alert("Reset interval must be a number.");

    try {
      await createTeam(name, description, interval || 0);
      router.back();
    } catch (err) {
      console.error(err);
      alert("Could not create team.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient colors={colors.backgroundGradient} style={{ flex: 1, paddingHorizontal: 20, paddingTop: 60 }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
            <Text style={{ fontSize: 34, fontWeight: "700", color: colors.textPrimary, marginBottom: 30 }}>Create a Team</Text>
            <FormInput label="Team Name" value={name} onChangeText={setName} placeholder="Enter team name" />
            <FormInput label="Reset Interval" value={resetInterval} onChangeText={setResetInterval} placeholder="Enter number of days" keyboardType="numeric" />
            <FormInput label="Description" value={description} onChangeText={setDescription} placeholder="Optional description" multiline />
            <GradientButton title="Create Team" onPress={handleCreate} />
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
