import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import ActivityStats from "../../components/ActivityStats";
import CompetitorComparison from "../../components/CompetitorComparison";
import PointsComparison from "../../components/PointsComparison";
import TeamLeaderboard from "../../components/TeamLeaderboard";
import TeamSelector from "../../components/TeamSelector";
import { AuthContext } from "../../context/AuthContext";
import { TeamContext } from "../../context/TeamProvider";
import { theme } from "../../theme/colors";



export default function TeamsScreen() {
  const { teams, getTeams } = useContext(TeamContext);
  const { userData, user, getUserData } = useContext(AuthContext);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? theme.dark : theme.light;

  const fabGradient = colorScheme === "dark" ? ["#5B9DFE", "#2563EB"] : color.buttonGradient;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [userTeamData, setUserTeamData] = useState(null);
  const [memberProfiles, setMemberProfiles] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fetch teams and user detailed data
  const fetchTeams = useCallback(async () => {
    try {
      await getTeams();
      // Fetch detailed user data from current team
      if (selectedTeamId && user?.uid) {
        const detailedData = await getUserData(user.uid);
        setUserTeamData(detailedData);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getTeams, selectedTeamId, user?.uid, getUserData]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    fetchTeams();
  }, [fetchTeams]);

  // Load member profiles for selected team
  useEffect(() => {
    if (!selectedTeam) return;

    const loadProfiles = async () => {
      const entries = await Promise.all(
        selectedTeam.users.map(async (m) => {
          const profile = await getUserData(m.id);
          return [m.id, profile];
        })
      );

      setMemberProfiles(Object.fromEntries(entries));
    };

    loadProfiles();
  }, [selectedTeam, getUserData]);

  // Set default selected team on first load
  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  useFocusEffect(
    useCallback(() => {
      fetchTeams();
    }, [fetchTeams])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTeams();
  };

  // Get the selected team data
  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  if (loading && teams.length === 0) {
    return (
      <SafeAreaProvider>
        <LinearGradient colors={color.backgroundGradient} style={{ flex: 1 }}>
          <SafeAreaView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={color.text} />
          </SafeAreaView>
        </LinearGradient>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <LinearGradient colors={color.backgroundGradient} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          {teams.length === 0 ? (
            // Empty State - Improved
            <ScrollView
              contentContainerStyle={styles.emptyContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={color.text}
                />
              }
            >
              <View style={styles.emptyContent}>
                <LinearGradient 
                  colors={["#5B9DFE20", "#2563EB20"]} 
                  style={styles.emptyIconWrapper}
                >
                  <Ionicons name="people-outline" size={64} color={color.text} />
                </LinearGradient>
                
                <Text style={[styles.emptyTitle, { color: color.text }]}>
                  No Teams Yet
                </Text>
                
                <Text style={[styles.emptySubtitle, { color: color.textSecondary }]}>
                  Join or create a team to start competing and track your fitness journey with friends.
                </Text>

                <View style={styles.emptyButtonsContainer}>
                  <TouchableOpacity
                    style={styles.emptyPrimaryButton}
                    onPress={() => router.push("/teams/createTeam")}
                  >
                    <LinearGradient colors={fabGradient} style={styles.emptyButtonGradient}>
                      <Ionicons name="add-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                      <Text style={styles.emptyButtonText}>Create Team</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.emptySecondaryButton}
                    onPress={() => router.push("/teams/joinTeam")}
                  >
                    <LinearGradient colors={["#F3F4F6", "#E5E7EB"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.emptyButtonGradient}>
                      <Ionicons name="log-in" size={20} color={color.text} style={{ marginRight: 8 }} />
                      <Text style={[styles.emptyButtonText, { color: color.text }]}>Join Team</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          ) : (
            // Teams Content - Improved
            <Animated.ScrollView
              style={{ opacity: fadeAnim }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={color.text}
                />
              }
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              {/* Enhanced Header */}
              <View style={styles.headerContainer}>
                <View style={styles.headerTop}>
                  <View>
                    <Text style={[styles.headerGreeting, { color: color.textSecondary }]}>
                      WELCOME BACK
                    </Text>
                    <Text style={[styles.headerTitle, { color: color.text }]}>
                      {userData?.name || "User"}
                    </Text>
                  </View>
                  <LinearGradient 
                    colors={["#5B9DFE20", "#2563EB20"]} 
                    style={styles.headerAvatar}
                  >
                    <Ionicons name="person" size={24} color={color.text} />
                  </LinearGradient>
                </View>
                <View style={[styles.headerStats, { backgroundColor: `${color.text}05` }]}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: color.text }]}>
                      {userTeamData?.weeklyPoints || 0}
                    </Text>
                    <Text style={[styles.statLabel, { color: color.textSecondary }]}>
                      Weekly Pts
                    </Text>
                  </View>
                  <View style={[styles.statDivider, { backgroundColor: `${color.text}10` }]} />
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: color.text }]}>
                      {userTeamData?.dailyPoints?.[new Date().toISOString().split('T')[0]] || 0}
                    </Text>
                    <Text style={[styles.statLabel, { color: color.textSecondary }]}>
                      Today
                    </Text>
                  </View>
                  <View style={[styles.statDivider, { backgroundColor: `${color.text}10` }]} />
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: color.text }]}>
                      {teams.length}
                    </Text>
                    <Text style={[styles.statLabel, { color: color.textSecondary }]}>
                      Team{teams.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
                {/* Team Selector - Moved Below Name */}
                {teams.length > 1 && (
                  <View>
                    <Text style={[styles.sectionLabel, { color: color.textSecondary, marginLeft: 0 }]}>
                      YOUR TEAMS
                    </Text>
                    <TeamSelector
                      teams={teams}
                      selectedTeamId={selectedTeamId}
                      onSelectTeam={setSelectedTeamId}
                    />
                  </View>
                )}
                
                <PointsComparison 
                  team={selectedTeam}
                  userPoints={userTeamData?.weeklyPoints}
                  currentUserId={user?.uid}
                />
                

              </View>

              {/* Selected Team Content - Improved Layout */}
              {selectedTeam && (
                <>
                  {/* Last Activity Card */}
                  {userTeamData?.lastPointChange && (
                    <View style={styles.lastActivityContainer}>
                      <Text style={[styles.sectionLabel, { color: color.textSecondary }]}>
                        LAST ACTIVITY
                      </Text>
                      <LinearGradient
                        colors={colorScheme === "dark" ? ["#1E293B", "#0F172A"] : ["#F8FAFC", "#F1F5F9"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.lastActivityCard, { borderColor: `${color.text}15` }]}
                      >
                        <View style={styles.lastActivityContent}>
                          <View style={styles.lastActivityLeft}>
                            <LinearGradient
                              colors={["#5B9DFE", "#2563EB"]}
                              style={styles.activityIcon}
                            >
                              <Ionicons 
                                name={userTeamData.lastPointChange.activity === "running" ? "flash" : 
                                      userTeamData.lastPointChange.activity === "cycling" ? "bicycle" :
                                      userTeamData.lastPointChange.activity === "swimming" ? "water" : "flash"} 
                                size={24} 
                                color="#fff" 
                              />
                            </LinearGradient>
                            <View style={styles.activityInfo}>
                              <Text style={[styles.activityName, { color: color.text }]}>
                                {userTeamData.lastPointChange.activity?.charAt(0).toUpperCase() + userTeamData.lastPointChange.activity?.slice(1)}
                              </Text>
                              <Text style={[styles.activityMeta, { color: color.textSecondary }]}>
                                {userTeamData.lastPointChange.hours}h • {new Date(userTeamData.lastPointChange.timestamp).toLocaleDateString()}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.lastActivityRight}>
                            <Text style={[styles.pointsBadge, { color: color.text }]}>
                              +{userTeamData.lastPointChange.amount}
                            </Text>
                            <Text style={[styles.pointsLabel, { color: color.textSecondary }]}>
                              pts
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </View>
                  )}

                  {/* Competitor Comparison Section */}
                  <View style={styles.sectionContainer}>
                    <CompetitorComparison 
                      team={selectedTeam} 
                      currentUserId={user?.uid}
                    />
                  </View>

                  {/* Activity Stats Section */}
                  <View style={styles.sectionContainer}>
                    <ActivityStats 
                      team={selectedTeam}
                      currentUserId={user?.uid}
                    />
                  </View>

                  {/* Leaderboard Section */}
                  <View style={styles.leaderboardContainer}>
                    <Text style={[styles.sectionLabel, { color: color.textSecondary }]}>
                      TEAM LEADERBOARD
                    </Text>
                    <TeamLeaderboard team={selectedTeam} memberProfiles={memberProfiles} />
                  </View>
                </>
              )}
            </Animated.ScrollView>
          )}

          {/* Enhanced Floating Action Button */}
          {selectedTeam && (
            <TouchableOpacity
              style={styles.fabContainer}
              onPress={() => router.push(`/teams/add/${selectedTeamId}`)}
              activeOpacity={0.8}
            >
              <LinearGradient colors={fabGradient} style={styles.fab}>
                <Ionicons name="add" size={32} color="#fff" />
              </LinearGradient>
              <Text style={styles.fabLabel}>Log Activity</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  emptyContent: {
    alignItems: "center",
    width: "100%",
  },
  emptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  emptyButtonsContainer: {
    width: "100%",
    gap: 12,
  },
  emptyPrimaryButton: {
    width: "100%",
  },
  emptySecondaryButton: {
    width: "100%",
  },
  emptyButtonGradient: {
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Header - Enhanced
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerGreeting: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
  },
  headerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  headerStats: {
    flexDirection: "row",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    height: 40,
  },

  // Section Label
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 12,
    marginLeft: 20,
  },

  // Selector Container
  selectorContainer: {
    marginVertical: 12,
  },

  // Section Containers
  sectionContainer: {
    marginTop: 8,
  },
  leaderboardContainer: {
    marginTop: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  // Floating Action Button - Enhanced
  fabContainer: {
    position: "absolute",
    bottom: 32,
    right: 20,
    alignItems: "flex-end",
    gap: 8,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  fabLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: "hidden",
  },

  // Last Activity Card
  lastActivityContainer: {
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  lastActivityCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  lastActivityContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastActivityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  lastActivityRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  activityIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  activityInfo: {
    gap: 2,
  },
  activityName: {
    fontSize: 16,
    fontWeight: "700",
  },
  activityMeta: {
    fontSize: 12,
    fontWeight: "500",
  },
  pointsBadge: {
    fontSize: 18,
    fontWeight: "800",
  },
  pointsLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
