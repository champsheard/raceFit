import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Pressable,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TeamContext } from "../../context/TeamProvider";
import { theme } from "../../theme/colors";

export default function TeamPage({ mode = "light" }) {
  const { teamId } = useLocalSearchParams();
  const { listenToTeam, leaveTeam } = useContext(TeamContext);
  const [team, setTeam] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  const currentTheme = theme[mode];

  useEffect(() => {
    const unsub = listenToTeam(teamId, setTeam);
    return unsub;
  }, [teamId]);

  useEffect(() => {
    if (team) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
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

  const handleShowInfo = () => {
    Alert.alert(
      "📊 Team Statistics",
      `Team: ${team.name}\nMembers: ${team.users.length}\nTotal Points: ${team.users.reduce((acc, u) => acc + u.points, 0)}\nJoin Code: ${team.joinCode?.code || "N/A"}`,
      [{ text: "Close", style: "cancel" }]
    );
  };

  const handleLeaveTeam = () => {
    Alert.alert(
      "Leave Team",
      "Are you sure you want to leave this team?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Leave", style: "destructive", onPress: () => {
          leaveTeam(teamId);
          router.back();
        } },
      ]
    );
  };

  if (!team) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: currentTheme.inputBackground }]}>
        <View style={styles.loadingPulse}>
          <Text style={[styles.loadingText, { color: currentTheme.buttonGradient[0] }]}>
            Loading team...
          </Text>
        </View>
      </View>
    );
  }

  const topPerformer = team.users.reduce((max, user) =>
    user.points > max.points ? user : max, team.users[0]
  );

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.inputBackground }]}>
      <StatusBar barStyle={mode === "light" ? "dark-content" : "light-content"} />
      
      <LinearGradient
        colors={currentTheme.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              { backgroundColor: `${currentTheme.buttonGradient[0]}33` },
              pressed && { backgroundColor: `${currentTheme.buttonGradient[0]}55` },
            ]}
          >
            <Text style={[styles.backIcon, { color: currentTheme.text }]}>←</Text>
          </Pressable>

          <Animated.View style={[styles.headerInfo, { opacity: fadeAnim }]}>
            <Text style={[styles.teamName, { color: currentTheme.text }]}>{team.name}</Text>
            <View style={styles.statsRow}>
              <View style={[styles.statBadge, { backgroundColor: `${currentTheme.buttonGradient[0]}33` }]}>
                <Text style={[styles.statValue, { color: currentTheme.text }]}>{team.users.length}</Text>
                <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Members</Text>
              </View>
              <View style={[styles.statBadge, { backgroundColor: `${currentTheme.buttonGradient[0]}33` }]}>
                <Text style={[styles.statValue, { color: currentTheme.text }]}>
                  {team.users.reduce((acc, u) => acc + u.points, 0)}
                </Text>
                <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Total Points</Text>
              </View>
            </View>
          </Animated.View>

          {/* Leave Team Button */}
          <TouchableOpacity
            onPress={handleLeaveTeam}
            style={[styles.infoButton, { backgroundColor: `${currentTheme.buttonGradient[0]}33` }]}
          >
            <Text style={[styles.infoIcon, { color: currentTheme.text }]}>🚪</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.joinCodeCard, { backgroundColor: currentTheme.inputBackground }]}>
          <Text style={[styles.joinCodeLabel, { color: currentTheme.textSecondary }]}>Team Join Code</Text>
          <Text style={[styles.joinCode, { color: currentTheme.buttonGradient[0] }]}>
            {team.joinCode?.code || "N/A"}
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: currentTheme.buttonGradient[0] }]}
              onPress={handleShare}
            >
              <Text style={[styles.shareButtonText, { color: "#fff" }]}>Share Code</Text>
            </TouchableOpacity>

            {/* Move Stats Button here */}
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: currentTheme.buttonGradient[1] }]}
              onPress={handleShowInfo}
            >
              <Text style={[styles.shareButtonText, { color: "#fff" }]}>Stats</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.leaderboardContainer}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Leaderboard</Text>

        <FlatList
          data={[...team.users].sort((a, b) => b.points - a.points)}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const isTop = index === 0;
            const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;

            return (
              <Animated.View
                style={[
                  styles.memberCard,
                  isTop && { borderColor: currentTheme.buttonGradient[0], borderWidth: 2 },
                  { opacity: fadeAnim, backgroundColor: currentTheme.inputBackground },
                ]}
              >
                <View style={styles.memberLeft}>
                  <LinearGradient
                    colors={isTop ? currentTheme.buttonGradient : ["#f0f0f0", "#f0f0f0"]}
                    style={[styles.rankBadge]}
                  >
                    <Text
                      style={[
                        styles.rankText,
                        isTop && { color: "#fff", fontSize: 18 },
                        { color: isTop ? "#fff" : currentTheme.textSecondary },
                      ]}
                    >
                      {medal || `#${index + 1}`}
                    </Text>
                  </LinearGradient>
                  <View style={styles.memberInfo}>
                    <Text
                      style={[
                        styles.memberName,
                        isTop && { color: currentTheme.buttonGradient[0], fontWeight: "700" },
                        { color: currentTheme.text },
                      ]}
                    >
                      {item.name}
                    </Text>
                    {item.id === topPerformer.id && (
                      <Text style={[styles.performerBadge, { color: currentTheme.buttonGradient[0] }]}>⭐ Top Performer</Text>
                    )}
                  </View>
                </View>
                <LinearGradient
                  colors={isTop ? currentTheme.buttonGradient : ["#f0f0f0", "#f0f0f0"]}
                  style={[styles.pointsBadge]}
                >
                  <Text
                    style={[
                      styles.pointsText,
                      isTop && { color: "#fff" },
                      { color: isTop ? "#fff" : currentTheme.textSecondary },
                    ]}
                  >
                    {item.points}
                  </Text>
                  <Text style={[styles.pointsLabel, { color: currentTheme.textSecondary }]}>pts</Text>
                </LinearGradient>
              </Animated.View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingPulse: { padding: 30, borderRadius: 20, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  loadingText: { fontSize: 18, fontWeight: "600" },
  headerGradient: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerContent: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 },
  backButton: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center" },
  backIcon: { fontSize: 24, fontWeight: "bold" },
  headerInfo: { flex: 1, marginHorizontal: 16 },
  teamName: { fontSize: 28, fontWeight: "800", marginBottom: 12 },
  statsRow: { flexDirection: "row", gap: 12 },
  statBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 12, marginTop: 2 },
  infoButton: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center" },
  infoIcon: { fontSize: 24 },
  joinCodeCard: { borderRadius: 16, padding: 20, alignItems: "center", gap: 12 },
  joinCodeLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  joinCode: { fontSize: 32, fontWeight: "800", letterSpacing: 4, marginBottom: 16 },
  shareButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  shareButtonText: { fontWeight: "700", fontSize: 14 },
  leaderboardContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  listContent: { paddingBottom: 20 },
  memberCard: { borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  memberLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  rankBadge: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center", marginRight: 12 },
  rankText: { fontSize: 16, fontWeight: "700" },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 18, fontWeight: "600" },
  performerBadge: { fontSize: 12, marginTop: 4 },
  pointsBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, alignItems: "center" },
  pointsText: { fontSize: 20, fontWeight: "800" },
  pointsLabel: { fontSize: 11, marginTop: 2 },
});
