import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import {
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";
import { theme } from "../theme/colors";
import { designSystem } from "../theme/designSystem";
import { ACTIVITIES } from "../utils/activities";

export default function CompetitorComparison({ team, currentUserId }) {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? theme.dark : theme.light;

  const comparisonData = useMemo(() => {
    if (!team?.users || team.users.length === 0) return null;

    const currentUser = team.users.find((u) => u.id === currentUserId);
    if (!currentUser) return null;

    // Get top 3 competitors (excluding current user)
    const competitors = team.users
      .filter((u) => u.id !== currentUserId)
      .slice(0, 3);

    return { currentUser, competitors };
  }, [team?.users, currentUserId]);

  if (!comparisonData || comparisonData.competitors.length === 0) {
    return null;
  }

  const { currentUser, competitors } = comparisonData;
  const maxPoints = Math.max(currentUser.weeklyPoints, ...competitors.map((c) => c.weeklyPoints));

  const getActivityIcon = (activity) => {
    const act = ACTIVITIES.find((a) => a.id === activity);
    return act ? act.icon : "fitness";
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Ionicons name="flame" size={20} color="#FF6B6B" />
        <Text style={[s.headerText, { color: color.text }]}>
          COMPETING NOW
        </Text>
      </View>

      {/* Current User Card */}
      <LinearGradient
        colors={colorScheme === "dark" ? ["#2563EB", "#1D4ED8"] : ["#E0E7FF", "#DDD6FE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.userCardContainer}
      >
        <View style={s.userCard}>
          <View style={s.userInfo}>
            <View style={[s.userAvatar, { backgroundColor: "#3B82F6" }]}>
              <Text style={s.avatarInitial}>YOU</Text>
            </View>
            <View style={s.userDetails}>
              <Text style={[s.userName, { color: color.text }]}>
                {currentUser.name || "You"}
              </Text>
              <Text style={[s.userSubtext, { color: color.textSecondary }]}>
                Your Points
              </Text>
            </View>
          </View>
          <View style={s.pointsContainer}>
            <Text style={[s.pointsValue, { color: "#3B82F6" }]}>
              {currentUser.weeklyPoints}
            </Text>
            <View style={[s.progressBar, { backgroundColor: `${color.textSecondary}15` }]}>
              <LinearGradient
                colors={["#3B82F6", "#1D4ED8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  s.progressFill,
                  { width: `${(currentUser.weeklyPoints / maxPoints) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Competitors */}
      <View style={s.competitorsContainer}>
        {competitors.map((competitor, idx) => {
          const competitorPercentage = (competitor.weeklyPoints / maxPoints) * 100;
          const isAhead = competitor.weeklyPoints > currentUser.weeklyPoints;
          const pointsDiff = Math.abs(competitor.weeklyPoints - currentUser.weeklyPoints);

          return (
            <LinearGradient
              key={competitor.id}
              colors={
                colorScheme === "dark"
                  ? ["#374151", "#1F2937"]
                  : ["#F3F4F6", "#E5E7EB"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.competitorCard}
            >
              <View style={s.competitorContent}>
                <View style={s.competitorTop}>
                  <View style={s.competitorInfo}>
                    <View style={[s.competitorAvatar, getCompetitorAvatarColor(idx)]}>
                      <Text style={s.competitorInitial}>
                        {competitor.name?.[0]?.toUpperCase() || "?"}
                      </Text>
                    </View>
                    <View style={s.competitorDetails}>
                      <Text style={[s.competitorName, { color: color.text }]}>
                        {competitor.name || "Competitor"}
                      </Text>
                      <Text style={[s.competitorStatus, { color: color.textSecondary }]}>
                        {isAhead ? "🔥 Ahead" : "💪 Close"}
                      </Text>
                    </View>
                  </View>
                  <View style={s.competitorPoints}>
                    <Text style={[s.competitorPointsValue, { color: color.text }]}>
                      {competitor.weeklyPoints}
                    </Text>
                    <Text
                      style={[
                        s.pointsDiff,
                        { color: isAhead ? "#EF4444" : "#10B981" },
                      ]}
                    >
                      {isAhead ? "+" : "-"}{pointsDiff}
                    </Text>
                  </View>
                </View>
                <View style={[s.progressBar, { backgroundColor: `${color.textSecondary}15` }]}>
                  <LinearGradient
                    colors={getCompetitorGradient(idx)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      s.progressFill,
                      { width: `${competitorPercentage}%` },
                    ]}
                  />
                </View>
              </View>
            </LinearGradient>
          );
        })}
      </View>
    </View>
  );
}

const getCompetitorAvatarColor = (idx) => {
  const colors = [
    { backgroundColor: "#F59E0B" },
    { backgroundColor: "#8B5CF6" },
    { backgroundColor: "#EC4899" },
  ];
  return colors[idx % colors.length];
};

const getCompetitorGradient = (idx) => {
  const gradients = [
    ["#F59E0B", "#D97706"],
    ["#8B5CF6", "#7C3AED"],
    ["#EC4899", "#DB2777"],
  ];
  return gradients[idx % gradients.length];
};

const s = StyleSheet.create({
  container: {
    paddingHorizontal: designSystem.spacing.xl,
    marginVertical: designSystem.spacing.xl,
    gap: designSystem.spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: designSystem.spacing.md,
    marginBottom: designSystem.spacing.md,
  },
  headerText: {
    ...designSystem.typography.labelSM,
  },
  userCardContainer: {
    borderRadius: designSystem.borderRadius.lg,
    padding: 1,
  },
  userCard: {
    backgroundColor: "#FFF",
    borderRadius: designSystem.borderRadius.lg,
    padding: designSystem.spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: designSystem.spacing.md,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: designSystem.spacing.md,
  },
  avatarInitial: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...designSystem.typography.bodyMD,
    marginBottom: designSystem.spacing.xs,
  },
  userSubtext: {
    ...designSystem.typography.bodyXS,
  },
  pointsContainer: {
    alignItems: "flex-end",
    width: 100,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: designSystem.spacing.md,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    width: "100%",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  competitorsContainer: {
    gap: designSystem.spacing.lg,
  },
  competitorCard: {
    borderRadius: designSystem.borderRadius.md,
    padding: designSystem.spacing.md,
  },
  competitorContent: {
    gap: designSystem.spacing.lg,
  },
  competitorTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  competitorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  competitorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: designSystem.spacing.md,
  },
  competitorInitial: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
  competitorDetails: {
    flex: 1,
  },
  competitorName: {
    ...designSystem.typography.bodyMD,
    marginBottom: designSystem.spacing.xs,
  },
  competitorStatus: {
    ...designSystem.typography.bodyXS,
  },
  competitorPoints: {
    alignItems: "flex-end",
  },
  competitorPointsValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: designSystem.spacing.xs,
  },
  pointsDiff: {
    ...designSystem.typography.labelMD,
  },
});
