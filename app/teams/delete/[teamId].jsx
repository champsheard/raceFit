import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Alert, Animated, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TeamContext } from "../../../context/TeamProvider";
import { theme } from "../../../theme/colors";

export default function DeleteTeamPage({ mode = "light" }) {
  const { teamID } = useLocalSearchParams();
  const { deleteTeam } = useContext(TeamContext);
  const router = useRouter();

  const palette = mode === "dark" ? theme.dark : theme.light;
  const scale = new Animated.Value(1);

  const handleDeletePressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handleDeletePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Team",
      "Are you sure you want to permanently delete this team? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteTeam(teamID);
            if (success) router.push("/"); // Redirect home after deletion
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={palette.backgroundGradient} style={{ flex: 1 }}>
      <StatusBar barStyle={mode === "light" ? "dark-content" : "light-content"} />

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.floatingButton, { left: 20, backgroundColor: palette.card + "DD" }]}
      >
        <Ionicons name="arrow-back" size={24} color={palette.text} />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={[styles.title, { color: palette.text }]}>
          Delete Team
        </Text>
        <Text style={[styles.warning, { color: palette.buttonGradient[0] }]}>
          This action cannot be undone!
        </Text>

        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: palette.buttonGradient[0] }]}
            onPressIn={handleDeletePressIn}
            onPressOut={handleDeletePressOut}
            onPress={handleDelete}
          >
            <Text style={styles.deleteText}>Delete Team</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    top: 50,
    padding: 12,
    borderRadius: 50,
    zIndex: 99,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 15,
    letterSpacing: 1,
  },
  warning: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 50,
    lineHeight: 24,
  },
  deleteButton: {
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  deleteText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
    textAlign: "center",
  },
});
