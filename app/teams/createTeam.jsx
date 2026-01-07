import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, useColorScheme } from "react-native";
import GradientButton from "../../components/GradientButton";
import { TeamContext } from "../../context/TeamProvider";
import { theme } from "../../theme/colors";

export default function CreateTeamPage() {
  const router = useRouter();
  const { createTeam } = useContext(TeamContext);
  const systemTheme = useColorScheme();
  const colors = theme[systemTheme ?? "light"];
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return alert("Please enter a team name.");

    setLoading(true);
    try {
      await createTeam(name, description, 0);
      router.back();
    } catch (err) {
      console.error(err);
      alert("Could not create team.");
    }
    setLoading(false);
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
    formSection: {
      marginBottom: 36,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    inputField: {
      paddingVertical: 12,
      paddingHorizontal: 0,
      fontSize: 16,
      color: colors.text,
      borderBottomWidth: 2,
      borderBottomColor: focusedInput === "name" ? "#2563EB" : colors.inputBorder,
    },
    inputFieldDescription: {
      paddingVertical: 12,
      paddingHorizontal: 0,
      fontSize: 16,
      color: colors.text,
      borderBottomWidth: 2,
      borderBottomColor: focusedInput === "description" ? "#2563EB" : colors.inputBorder,
      minHeight: 100,
      textAlignVertical: "top",
    },
    scrollContent: {
      paddingBottom: 50,
    },
    actionButton: {
      marginTop: 24,
    },
    emptyState: {
      fontSize: 14,
      color: colors.placeholder,
      fontStyle: "italic",
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
              <Text style={dynamicStyles.title}>Create Team</Text>
              <Text style={dynamicStyles.subtitle}>Start your competitive journey</Text>
            </View>

            <ScrollView 
              contentContainerStyle={dynamicStyles.scrollContent} 
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Icon */}
              <View style={dynamicStyles.iconCircle}>
                <Ionicons name="people" size={40} color="#2563EB" />
              </View>

              {/* Team Name Input */}
              <View style={dynamicStyles.formSection}>
                <Text style={dynamicStyles.inputLabel}>Team Name</Text>
                <TextInput
                  style={dynamicStyles.inputField}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter team name"
                  placeholderTextColor={colors.placeholder}
                  onFocus={() => setFocusedInput("name")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              {/* Description Input */}
              <View style={dynamicStyles.formSection}>
                <Text style={dynamicStyles.inputLabel}>Description</Text>
                <TextInput
                  style={dynamicStyles.inputFieldDescription}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Optional team description"
                  placeholderTextColor={colors.placeholder}
                  multiline
                  onFocus={() => setFocusedInput("description")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              {/* Create Button */}
              <View style={dynamicStyles.actionButton}>
                <GradientButton 
                  title={loading ? "Creating..." : "Create Team"} 
                  onPress={handleCreate}
                  disabled={loading || !name.trim()}
                />
              </View>
            </ScrollView>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
