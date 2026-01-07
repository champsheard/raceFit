import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { theme } from "../theme/colors";
import { designSystem } from "../theme/designSystem";

export default function PointsComparison({ team, userPoints, currentUserId }) {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? theme.dark : theme.light;

  if (!team || !team.users) {
    return null;
  }

  // Get all members with their points
  const memberPoints = team.users
    .map((member) => ({
      id: member.id,
      name: member.name || "Unknown",
      points: member.points || 0,
      isCurrentUser: member.id === currentUserId,
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 4); // Top 4 members

  if (memberPoints.length === 0) {
    return null;
  }

  const maxPoints = Math.max(...memberPoints.map((m) => m.points), 1);

  return (
    <View style={s.container}>
      <View style={s.titleContainer}>
        <Ionicons name="flame" size={18} color="#FF6B6B" />
        <Text style={[s.title, { color: color.text }]}>Your Rank</Text>
      </View>

      <View style={s.comparisonGrid}>
        {memberPoints.map((member, index) => {
          const percentage = (member.points / maxPoints) * 100;
          const isCurrentUser = member.isCurrentUser;

          return (
            <View key={member.id} style={s.memberItem}>
              <View style={s.memberHeader}>
                <Text
                  style={[
                    s.rank,
                    {
                      color: isCurrentUser ? "#5B9DFE" : color.textSecondary,
                      fontWeight: isCurrentUser ? "800" : "600",
                    },
                  ]}
                >
                  #{index + 1}
                </Text>
                <Text
                  style={[
                    s.memberName,
                    {
                      color: color.text,
                      fontWeight: isCurrentUser ? "700" : "500",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {isCurrentUser ? "You" : member.name}
                </Text>
              </View>

              <View style={[s.barContainer, { backgroundColor: `${color.textSecondary}15` }]}>
                <LinearGradient
                  colors={
                    isCurrentUser
                      ? ["#5B9DFE", "#2563EB"]
                      : colorScheme === "dark"
                      ? ["#374151", "#1F2937"]
                      : ["#E5E7EB", "#D1D5DB"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    s.bar,
                    {
                      width: `${percentage}%`,
                      shadowOpacity: isCurrentUser ? 0.3 : 0.1,
                    },
                  ]}
                >
                  <View style={s.shimmer} />
                </LinearGradient>
              </View>

              <Text
                style={[
                  s.points,
                  {
                    color: isCurrentUser ? "#5B9DFE" : color.textSecondary,
                    fontWeight: isCurrentUser ? "700" : "600",
                  },
                ]}
              >
                {member.points} pts
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: designSystem.spacing.xl,
    marginVertical: designSystem.spacing.md,
    gap: designSystem.spacing.md,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: designSystem.spacing.sm,
  },
  title: {
    ...designSystem.typography.labelSM,
  },
  comparisonGrid: {
    gap: designSystem.spacing.lg,
  },
  memberItem: {
    gap: designSystem.spacing.sm,
  },
  memberHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: designSystem.spacing.md,
  },
  rank: {
    ...designSystem.typography.labelMD,
    minWidth: 28,
  },
  memberName: {
    ...designSystem.typography.bodyMD,
    flex: 1,
  },
  barContainer: {
    height: 24,
    borderRadius: designSystem.borderRadius.sm,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: designSystem.borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 8,
    ...designSystem.shadows.md,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: designSystem.borderRadius.sm,
  },
  points: {
    ...designSystem.typography.labelMD,
    textAlign: "right",
    paddingRight: designSystem.spacing.md,
  },
});
