import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import { theme } from "../theme/colors";
import { designSystem } from "../theme/designSystem";
import { createComponentStyles } from "../styles/componentStyles";

export default function TeamStatsCard({ team }) {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? theme.dark : theme.light;
  const styles = createComponentStyles(color);

  // Calculate weekly points and stats
  const stats = useMemo(() => {
    if (!team?.users || team.users.length === 0) {
      return {
        topPlayer: null,
        topPlayerPoints: 0,
        totalPoints: 0,
        memberCount: 0,
        yourRank: 0,
        yourPoints: 0,
      };
    }

    const totalPoints = team.users.reduce((sum, u) => sum + (u.points || 0), 0);
    const topPlayer = team.users[0];
    const memberCount = team.users.length;

    return {
      topPlayer: topPlayer?.name || "Unknown",
      topPlayerPoints: topPlayer?.points || 0,
      totalPoints,
      memberCount,
      yourRank: memberCount > 0 ? 1 : 0,
      yourPoints: team.users[0]?.points || 0,
    };
  }, [team?.users]);

  return (
    <View style={[s.container, { backgroundColor: color.cardBackground }]}>
      {/* Team Header */}
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.titleMD, { color: color.text }]}>
            {team.name}
          </Text>
          <Text style={[styles.caption, { color: color.textSecondary }]}>
            {stats.memberCount} members
          </Text>
        </View>
      </View>

        {/* Stats Grid */}
        <View style={s.statsGrid}>
          {/* Top Player */}
          <View style={s.statBox}>
            <View style={s.statIcon}>
              <Ionicons name="trophy" size={20} color="#2563EB" />
            </View>
            <Text style={[s.statLabel, { color: color.textSecondary }]}>
              Top Player
            </Text>
            <Text style={[s.statValue, { color: color.text }]}>
              {stats.topPlayer}
            </Text>
            <Text style={[s.statSubValue, { color: color.textSecondary }]}>
              {stats.topPlayerPoints} pts
            </Text>
          </View>

          {/* Total Points */}
          <View style={s.statBox}>
            <View style={s.statIcon}>
              <Ionicons name="flash" size={20} color="#3B82F6" />
            </View>
            <Text style={[s.statLabel, { color: color.textSecondary }]}>
              This Week
            </Text>
            <Text style={[s.statValue, { color: color.text }]}>
              {stats.totalPoints}
            </Text>
            <Text style={[s.statSubValue, { color: color.textSecondary }]}>
              team pts
            </Text>
          </View>

          {/* Average Points */}
          <View style={s.statBox}>
            <View style={s.statIcon}>
              <Ionicons name="trending-up" size={20} color="#60A5FA" />
            </View>
            <Text style={[s.statLabel, { color: color.textSecondary }]}>
              Average
            </Text>
            <Text style={[s.statValue, { color: color.text }]}>
              {stats.memberCount > 0
                ? Math.round(stats.totalPoints / stats.memberCount)
                : 0}
            </Text>
            <Text style={[s.statSubValue, { color: color.textSecondary }]}>
              per member
            </Text>
          </View>
        </View>

        {/* Leaderboard Preview */}
        {team.users && team.users.length > 0 && (
          <View style={s.leaderboardPreview}>
            <Text style={[s.leaderboardTitle, { color: color.text }]}>
              Top Competitors
            </Text>
            {team.users.slice(0, 3).map((member, idx) => (
              <View key={member.id} style={s.leaderboardItem}>
                <View style={[s.rankBadge, { backgroundColor: `${color.textSecondary}15` }]}>
                  <Text style={[s.rankText, { color: color.text }]}>#{idx + 1}</Text>
                </View>
                <Text style={[s.memberName, { color: color.text }]}>
                  {member.name || "Unknown"}
                </Text>
                <View style={{ marginLeft: "auto" }}>
                  <View style={[s.pointsBar, { backgroundColor: `${color.textSecondary}15` }]}>
                    <View
                      style={[
                        s.pointsFill,
                        {
                          width: `${
                            stats.topPlayerPoints > 0
                              ? (member.points / stats.topPlayerPoints) * 100
                              : 0
                          }%`,
                          backgroundColor:
                            idx === 0
                              ? "#2563EB"
                              : idx === 1
                              ? "#3B82F6"
                              : "#60A5FA",
                        },
                      ]}
                    />
                  </View>
                  <Text style={[s.pointsText, { color: color.textSecondary }]}>
                    {member.points || 0} pts
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    borderRadius: designSystem.card.borderRadius,
    padding: designSystem.card.padding,
    marginHorizontal: designSystem.spacing.xl,
    marginBottom: designSystem.spacing.md,
    ...designSystem.shadows.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: designSystem.spacing.xl,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: designSystem.spacing.xl,
    gap: designSystem.spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: designSystem.spacing.md,
    borderRadius: designSystem.borderRadius.md,
  },
  statIcon: {
    marginBottom: designSystem.spacing.sm,
  },
  statLabel: {
    ...designSystem.typography.labelXS,
    marginBottom: designSystem.spacing.xs,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: designSystem.spacing.xs,
  },
  statSubValue: {
    ...designSystem.typography.bodyXS,
  },
  leaderboardPreview: {
    borderTopWidth: 1,
    paddingTop: designSystem.spacing.md,
  },
  leaderboardTitle: {
    ...designSystem.typography.labelMD,
    marginBottom: designSystem.spacing.md,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: designSystem.spacing.md,
    gap: designSystem.spacing.md,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    ...designSystem.typography.labelSM,
  },
  memberName: {
    ...designSystem.typography.bodyMD,
    width: 80,
  },
  pointsBar: {
    height: 6,
    borderRadius: 3,
    width: 80,
  },
  pointsFill: {
    height: "100%",
    borderRadius: 3,
  },
  pointsText: {
    ...designSystem.typography.bodyXS,
    marginTop: designSystem.spacing.xs,
    textAlign: "right",
  },
});
