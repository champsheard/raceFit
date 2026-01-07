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

export default function ActivityStats({ team, currentUserId }) {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? theme.dark : theme.light;

  const stats = useMemo(() => {
    if (!team?.users || team.users.length === 0) return null;

    const currentUser = team.users.find((u) => u.id === currentUserId);
    if (!currentUser) return null;

    // Analyze most common activity and stats
    const activityCounts = {};
    const activityTotalHours = {};
    const activityTotalPoints = {};

    // Check lastPointChange for activity info
    if (currentUser.lastPointChange?.activity) {
      const activity = currentUser.lastPointChange.activity;
      const hours = currentUser.lastPointChange.hours || 0;
      const points = currentUser.lastPointChange.amount || 0;

      activityCounts[activity] = (activityCounts[activity] || 0) + 1;
      activityTotalHours[activity] = (activityTotalHours[activity] || 0) + hours;
      activityTotalPoints[activity] = (activityTotalPoints[activity] || 0) + points;
    }

    // Find most common activity
    let mostCommonActivity = null;
    let maxCount = 0;
    for (const [act, count] of Object.entries(activityCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonActivity = act;
      }
    }

    // Get team-wide activity stats
    const teamActivityCounts = {};
    team.users.forEach((user) => {
      if (user.lastPointChange?.activity) {
        const act = user.lastPointChange.activity;
        teamActivityCounts[act] = (teamActivityCounts[act] || 0) + 1;
      }
    });

    // Find team's most popular activity
    let teamMostPopular = null;
    let maxTeamCount = 0;
    for (const [act, count] of Object.entries(teamActivityCounts)) {
      if (count > maxTeamCount) {
        maxTeamCount = count;
        teamMostPopular = act;
      }
    }

    return {
      currentUser,
      mostCommonActivity,
      totalHoursThisActivity: activityTotalHours[mostCommonActivity] || 0,
      totalPointsThisActivity: activityTotalPoints[mostCommonActivity] || 0,
      teamMostPopular,
      teamActivityCount: maxTeamCount,
      weeklyPoints: currentUser.weeklyPoints || 0,
      totalActivityCount: Object.keys(activityCounts).length,
    };
  }, [team?.users, currentUserId]);

  if (!stats || !stats.mostCommonActivity) {
    return (
      <View style={s.container}>
        <View style={s.emptyState}>
          <Ionicons name="pulse" size={32} color={color.textSecondary} />
          <Text style={[s.emptyText, { color: color.textSecondary }]}>
            No activities logged yet
          </Text>
        </View>
      </View>
    );
  }

  const activityInfo = ACTIVITIES.find((a) => a.id === stats.mostCommonActivity);
  const teamActivityInfo = ACTIVITIES.find((a) => a.id === stats.teamMostPopular);

  return (
    <View style={s.container}>
      {/* Your Activity Stats */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: color.text }]}>
            YOUR STATS
          </Text>
        </View>

        {activityInfo && (
          <LinearGradient
            colors={colorScheme === "dark" ? ["#374151", "#1F2937"] : ["#F9FAFB", "#F3F4F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.statCard}
          >
            <View style={s.statContent}>
              <View style={s.activityIconContainer}>
                <LinearGradient
                  colors={["#6366F1", "#4F46E5"]}
                  style={s.activityIcon}
                >
                  <Ionicons name={activityInfo.icon} size={28} color="#FFF" />
                </LinearGradient>
              </View>

              <View style={s.statsGrid}>
                <View style={s.statItem}>
                  <Text style={[s.statLabel, { color: color.textSecondary }]}>
                    Most Done
                  </Text>
                  <Text style={[s.statValue, { color: color.text }]}>
                    {activityInfo.name}
                  </Text>
                </View>

                <View style={[s.statDivider, { backgroundColor: `${color.textSecondary}20` }]} />

                <View style={s.statItem}>
                  <Text style={[s.statLabel, { color: color.textSecondary }]}>
                    Hours
                  </Text>
                  <Text style={[s.statValue, { color: color.text }]}>
                    {stats.totalHoursThisActivity.toFixed(1)}h
                  </Text>
                </View>

                <View style={[s.statDivider, { backgroundColor: `${color.textSecondary}20` }]} />

                <View style={s.statItem}>
                  <Text style={[s.statLabel, { color: color.textSecondary }]}>
                    Points
                  </Text>
                  <Text style={[s.statValue, { color: color.text }]}>
                    {stats.totalPointsThisActivity}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        )}
      </View>

      {/* Team Trend */}
      {teamActivityInfo && (
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Ionicons name="trending-up" size={18} color="#10B981" />
            <Text style={[s.sectionTitle, { color: color.text }]}>
              TEAM TREND
            </Text>
          </View>

          <LinearGradient
            colors={colorScheme === "dark" ? ["#064E3B", "#047857"] : ["#ECFDF5", "#D1FAE5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.trendCard}
          >
            <View style={s.trendContent}>
              <View style={s.trendIconContainer}>
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  style={s.trendIcon}
                >
                  <Ionicons name={teamActivityInfo.icon} size={28} color="#FFF" />
                </LinearGradient>
              </View>

              <View style={s.trendInfo}>
                <Text style={[s.trendLabel, { color: color.textSecondary }]}>
                  Most Popular
                </Text>
                <Text style={[s.trendValue, { color: color.text }]}>
                  {teamActivityInfo.name}
                </Text>
                <Text style={[s.trendSubtext, { color: color.textSecondary }]}>
                  {stats.teamActivityCount} team member{stats.teamActivityCount !== 1 ? "s" : ""} doing this
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: designSystem.spacing.xl,
    marginVertical: designSystem.spacing.md,
    gap: designSystem.spacing.xl,
  },
  emptyState: {
    paddingVertical: designSystem.spacing.xxxl,
    justifyContent: "center",
    alignItems: "center",
    gap: designSystem.spacing.md,
  },
  emptyText: {
    ...designSystem.typography.bodyMD,
  },
  section: {
    gap: designSystem.spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: designSystem.spacing.sm,
    marginBottom: designSystem.spacing.xs,
  },
  sectionTitle: {
    ...designSystem.typography.labelSM,
  },
  statCard: {
    borderRadius: designSystem.borderRadius.lg,
    padding: designSystem.spacing.md,
  },
  statContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: designSystem.spacing.md,
  },
  activityIconContainer: {
    marginRight: designSystem.spacing.xs,
  },
  activityIcon: {
    width: 60,
    height: 60,
    borderRadius: designSystem.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  statsGrid: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  statItem: {
    flex: 1,
    paddingHorizontal: designSystem.spacing.xs,
  },
  statLabel: {
    ...designSystem.typography.labelXS,
    marginBottom: designSystem.spacing.xs,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: designSystem.spacing.xs,
  },
  trendCard: {
    borderRadius: designSystem.borderRadius.lg,
    padding: designSystem.spacing.md,
  },
  trendContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: designSystem.spacing.md,
  },
  trendIconContainer: {
    marginRight: designSystem.spacing.xs,
  },
  trendIcon: {
    width: 60,
    height: 60,
    borderRadius: designSystem.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  trendInfo: {
    flex: 1,
  },
  trendLabel: {
    ...designSystem.typography.labelXS,
    marginBottom: designSystem.spacing.xs,
  },
  trendValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: designSystem.spacing.xs,
  },
  trendSubtext: {
    ...designSystem.typography.bodyMD,
  },
});
