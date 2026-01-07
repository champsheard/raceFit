import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import { createComponentStyles } from "../styles/componentStyles";
import { theme } from "../theme/colors";
import { designSystem } from "../theme/designSystem";

export default function TeamLeaderboard({ team, memberProfiles = {} }) {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? theme.dark : theme.light;
  const styles = createComponentStyles(color);

  const stats = useMemo(() => {
    if (!team?.users || team.users.length === 0) {
      return {
        totalPoints: 0,
        memberCount: 0,
        avgPoints: 0,
      };
    }

    const totalPoints = team.users.reduce((sum, u) => sum + (u.weeklyPoints || 0), 0);
    const memberCount = team.users.length;
    const avgPoints = memberCount > 0 ? Math.round(totalPoints / memberCount) : 0;

    return {
      totalPoints,
      memberCount,
      avgPoints,
    };
  }, [team?.users]);

  const getRankColor = (rank) => {
    switch (rank) {
      case 0:
        return "#2563EB";
      case 1:
        return "#3B82F6";
      case 2:
        return "#60A5FA";
      default:
        return color.textSecondary;
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 0:
        return "trophy";
      case 1:
        return "medal";
      case 2:
        return "ribbon";
      default:
        return "ellipsis-horizontal";
    }
  };

  return (
    <ScrollView 
      style={{ flex: 1 }} 
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
    >
      {/* Team Header Stats */}
      <View style={s.statsHeader}>
        <View style={s.statItem}>
          <Text style={[s.statLabel, { color: color.textSecondary }]}>
            TOTAL POINTS
          </Text>
          <Text style={[s.statValue, { color: color.text }]}>
            {stats.totalPoints}
          </Text>
        </View>
        <View style={[s.statDivider, { backgroundColor: color.divider }]} />
        <View style={s.statItem}>
          <Text style={[s.statLabel, { color: color.textSecondary }]}>
            AVERAGE
          </Text>
          <Text style={[s.statValue, { color: color.text }]}>
            {stats.avgPoints}
          </Text>
        </View>
        <View style={[s.statDivider, { backgroundColor: color.divider }]} />
        <View style={s.statItem}>
          <Text style={[s.statLabel, { color: color.textSecondary }]}>
            PLAYERS
          </Text>
          <Text style={[s.statValue, { color: color.text }]}>
            {stats.memberCount}
          </Text>
        </View>
      </View>

      {/* Leaderboard Title */}
      <View style={s.titleContainer}>
        <Text style={[s.title, { color: color.text }]}>
          LEADERBOARD
        </Text>
      </View>

      {/* Leaderboard Columns Header */}
      <View style={[s.headerRow, { borderBottomColor: `${color.textSecondary}30` }]}>
        <Text style={[s.headerCol, { color: color.textSecondary, flex: 0.5 }]}>
          RANK
        </Text>
        <Text style={[s.headerCol, { color: color.textSecondary, flex: 2 }]}>
          PLAYER
        </Text>
        <Text style={[s.headerCol, { color: color.textSecondary, flex: 1, textAlign: "right" }]}>
          POINTS
        </Text>
      </View>

      {/* Leaderboard Rows */}
      <View style={s.leaderboard}>
        {team?.users && team.users.length > 0 ? (
          team.users.map((member, idx) => {
            const rankColor = getRankColor(idx);
            const rankIcon = getRankIcon(idx);
            const percentage = stats.totalPoints > 0 ? (member.weeklyPoints / stats.totalPoints) * 100 : 0;

            return (
              <View
                key={member.id}
                style={[
                  s.leaderboardRow,
                  {
                    borderBottomColor: `${color.textSecondary}15`,
                  },
                ]}
              >
                {/* Rank Badge */}
                <View style={s.rankContainer}>
                  <View
                    style={[
                      s.rankBadge,
                      { backgroundColor: rankColor },
                    ]}
                  >
                    <Ionicons
                      name={rankIcon}
                      size={14}
                      color={idx === 0 || idx === 1 ? "#000" : "#fff"}
                    />
                  </View>
                </View>

                {/* Player Name */}
                <View style={s.playerColumn}>
                  <View style={s.playerInfo}>
                    {memberProfiles[member.id]?.profilePhoto ? (
                      <Image
                        source={{ uri: memberProfiles[member.id].profilePhoto }}
                        style={styles.playerAvatar}
                      />
                    ) : (
                      <View style={[s.playerAvatar, { backgroundColor: `${color.text}15` }]}>
                        <Ionicons name="person" size={16} color={color.text} />
                      </View>
                    )}
                    <Text
                      style={[
                        s.playerName,
                        {
                          color: color.text,
                          fontWeight: idx === 0 ? "700" : "600",
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {memberProfiles[member.id]?.name ?? "Unknown"}
                    </Text>
                  </View>
                  {/* Progress Bar */}
                  <View style={[s.progressBarContainer, { backgroundColor: `${color.textSecondary}15` }]}>
                    <View
                      style={[
                        s.progressBar,
                        {
                          width: `${percentage}%`,
                          backgroundColor: rankColor,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* Points */}
                <View style={s.pointsColumn}>
                  <Text
                    style={[
                      s.points,
                      {
                        color: rankColor,
                        fontWeight: idx === 0 ? "700" : "600",
                      },
                    ]}
                  >
                    {member.weeklyPoints || 0}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={s.emptyState}>
            <Text style={[s.emptyText, { color: color.textSecondary }]}>
              No team members yet
            </Text>
          </View>
        )}
      </View>

      {/* Padding at bottom */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: designSystem.spacing.xl,
    paddingHorizontal: designSystem.spacing.md,
    marginBottom: designSystem.spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    ...designSystem.typography.labelXS,
    marginBottom: designSystem.spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: designSystem.spacing.md,
  },
  titleContainer: {
    paddingHorizontal: designSystem.spacing.md,
    marginBottom: designSystem.spacing.md,
  },
  title: {
    ...designSystem.typography.titleMD,
    letterSpacing: 1,
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: designSystem.spacing.md,
    paddingHorizontal: designSystem.spacing.md,
    borderBottomWidth: 1,
  },
  headerCol: {
    ...designSystem.typography.labelXS,
  },
  leaderboard: {
    paddingHorizontal: designSystem.spacing.md,
  },
  leaderboardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: designSystem.spacing.lg,
    borderBottomWidth: 1,
  },
  rankContainer: {
    flex: 0.5,
    alignItems: "center",
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    ...designSystem.shadows.md,
  },
  playerColumn: {
    flex: 2,
    marginHorizontal: designSystem.spacing.md,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: designSystem.spacing.md,
    marginBottom: designSystem.spacing.sm,
  },
  playerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  playerName: {
    ...designSystem.typography.bodySM,
    flex: 1,
  },
  progressBarContainer: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  pointsColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  points: {
    ...designSystem.typography.bodySM,
    fontWeight: "600",
  },
  emptyState: {
    paddingVertical: designSystem.spacing.xxxxl,
    alignItems: "center",
  },
  emptyText: {
    ...designSystem.typography.bodyMD,
  },
});
