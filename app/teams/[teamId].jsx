import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Platform,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { TeamContext } from "../../context/TeamProvider";
import { theme } from "../../theme/colors";

export default function TeamPage({ mode = "light" }) {
  const { teamId } = useLocalSearchParams();
  const { listenToTeam, leaveTeam } = useContext(TeamContext);
  const [team, setTeam] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  const palette = mode === "dark" ? theme.dark : theme.light;

  useEffect(() => {
    const unsub = listenToTeam(teamId, setTeam);
    return unsub;
  }, [teamId]);

  useEffect(() => {
    if (team) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [team]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my team "${team.name}" with code: ${team.joinCode?.code || "N/A"}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeaveTeam = () => {
    Alert.alert(
      "Leave Team",
      "Are you sure you want to leave this team?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            leaveTeam(teamId);
            router.back();
          },
        },
      ]
    );
  };

  const handleShowInfo = () => {
    Alert.alert(
      "📊 Team Statistics",
      `Team: ${team.name}\nMembers: ${team.users.length}\nTotal Points: ${team.users.reduce((a, u) => a + u.points, 0)}\nJoin Code: ${team.joinCode?.code || "N/A"}`,
      [{ text: "Close", style: "cancel" }]
    );
  };

  if (!team) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: palette.inputBackground }]}>
        <Text style={{ color: palette.text }}>Loading team...</Text>
      </View>
    );
  }

  const topPerformer = team.users.reduce(
    (max, user) => (user.points > max.points ? user : max),
    team.users[0]
  );

  return (
    <LinearGradient
      colors={palette.backgroundGradient}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle={mode === "light" ? "dark-content" : "light-content"} />

      {/* Floating Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.8}
        style={[
          styles.floatingButton,
          { left: 20, backgroundColor: palette.card + "CC" },
        ]}
      >
        <Ionicons name="arrow-back" size={24} color={palette.text} />
      </TouchableOpacity>

      {/* Floating Leave Button */}
      <TouchableOpacity
        onPress={handleLeaveTeam}
        activeOpacity={0.8}
        style={[
          styles.floatingButton,
          { right: 20, backgroundColor: palette.card + "CC" },
        ]}
      >
        <Ionicons name="exit-outline" size={24} color={palette.text} />
      </TouchableOpacity>

      <Animated.View
        style={{
          opacity: fadeAnim,
          marginTop: 100,
          paddingHorizontal: 20,
        }}
      >
        <Text style={[styles.title, { color: palette.text }]}>
          {team.name}
        </Text>

        {/* Join Code Box */}
        <View
          style={[
            styles.card,
            { backgroundColor: palette.card, borderColor: palette.inputBorder },
          ]}
        >
          <Text style={[styles.label, { color: palette.textSecondary }]}>
            Join Code
          </Text>

          <Text
            style={[styles.joinCode, { color: palette.buttonGradient[0] }]}
          >
            {team.joinCode?.code || "N/A"}
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: palette.buttonGradient[0] }]}
              onPress={handleShare}
            >
              <Text style={styles.buttonText}>Share Code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: palette.buttonGradient[1] }]}
              onPress={handleShowInfo}
            >
              <Text style={styles.buttonText}>Stats</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Leaderboard */}
        <Text style={[styles.sectionTitle, { color: palette.text }]}>
          Leaderboard
        </Text>

        <FlatList
          data={[...team.users].sort((a, b) => b.points - a.points)}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item, index }) => {
            const isTop = index === 0;
            return (
              <View
                style={[
                  styles.memberCard,
                  {
                    backgroundColor: palette.card,
                    borderColor: isTop ? palette.buttonGradient[0] : palette.inputBorder,
                  },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <LinearGradient
                    colors={
                      isTop ? palette.buttonGradient : [palette.card, palette.card]
                    }
                    style={styles.rankBadge}
                  >
                    <Text
                      style={{
                        color: isTop ? "#fff" : palette.textSecondary,
                        fontWeight: "700",
                      }}
                    >
                      {index + 1}
                    </Text>
                  </LinearGradient>

                  <View style={{ marginLeft: 12 }}>
                    <Text style={[styles.memberName, { color: palette.text }]}>
                      {item.name}
                    </Text>
                    {item.id === topPerformer.id && (
                      <Text style={{ color: palette.buttonGradient[0], fontSize: 12 }}>
                        ⭐ Top Performer
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: isTop ? palette.buttonGradient[0] : palette.text,
                    }}
                  >
                    {item.points}
                  </Text>
                  <Text style={{ color: palette.textSecondary, fontSize: 12 }}>pts</Text>
                </View>
              </View>
            );
          }}
        />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    padding: 10,
    borderRadius: 40,
    zIndex: 99,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    alignItems: "center",
  },
  label: { fontSize: 14, fontWeight: "600" },
  joinCode: { fontSize: 36, letterSpacing: 4, fontWeight: "800", marginBottom: 16 },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 10,
  },
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  memberName: { fontSize: 18, fontWeight: "600" },
});
