import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../../context/AuthContext";
import { TeamContext } from "../../../context/TeamProvider";
import { theme } from "../../../theme/colors";
import { ACTIVITIES, calculatePoints } from "../../../utils/activities";


export default function AddPointsScreen() {
  const router = useRouter();
  const { teamid } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? theme.dark : theme.light;
  const scrollViewRef = useRef(null);

  const { teams, addPointsToMembers } = useContext(TeamContext);
  const { getUserData } = useContext(AuthContext);

  const [selectedTeamId, setSelectedTeamId] = useState(teamid || null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberProfiles, setMemberProfiles] = useState({});
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("running");
  const [submitting, setSubmitting] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const gradient = colorScheme === "dark" ? ["#5B9DFE", "#2563EB"] : color.buttonGradient;

  const openModal = useCallback((modalType) => {
    setActiveModal(modalType);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Keyboard.dismiss();
  }, [fadeAnim]);

  const selectedTeam = useMemo(() => {
    return teams.find((t) => String(t.id) === String(selectedTeamId));
  }, [teams, selectedTeamId]);

  // Load member profiles when team changes
  useEffect(() => {
    if (!selectedTeam?.users) {
      setMemberProfiles({});
      return;
    }

    const loadProfiles = async () => {
      const profiles = {};
      
      for (const member of selectedTeam.users) {
        const userData = await getUserData(member.id);
        profiles[member.id] = userData;
      }
      
      setMemberProfiles(profiles);
    };

    loadProfiles();
  }, [selectedTeam, getUserData]);

  const toggleMember = (member) => {
    const exists = selectedMembers.some((u) => u.id === member.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (exists) {
      setSelectedMembers(selectedMembers.filter((u) => u.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const submit = async () => {
    if (!selectedTeamId) {
      Alert.alert("Select team", "Please choose a team.");
      return;
    }

    if (!selectedMembers.length) {
      Alert.alert("Select members", "Please choose at least one team member.");
      return;
    }

    if (!hours || Number(hours) === 0) {
      Alert.alert("Invalid hours", "Enter a non-zero hour value.");
      return;
    }

    try {
      setSubmitting(true);
      Keyboard.dismiss();
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const points = calculatePoints(selectedActivity, hours);

      await addPointsToMembers(
        selectedTeamId,
        selectedMembers.map((m) => m.id),
        points,
        { description, hours: Number(hours), activity: selectedActivity }
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Points added successfully!");
      router.back();
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Could not add points.");
    } finally {
      setSubmitting(false);
    }
  };

  // Activity Modal Component
  const ActivityModal = () => (
    <Modal
      visible={activeModal === "activity"}
      transparent
      animationType="none"
      onRequestClose={() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setActiveModal(null));
      }}
    >
      <TouchableOpacity
        style={styles.iOSOverlay}
        activeOpacity={1}
        onPress={() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setActiveModal(null));
        }}
      >
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.sheetHeader, { backgroundColor: color.cardBackground }]}>
            <View style={styles.dragHandle} />
            <Text style={[styles.sheetTitle, { color: color.text }]}>Select Activity</Text>
          </View>
          <FlatList
            data={ACTIVITIES}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            renderItem={({ item: act }) => (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setSelectedActivity(act.id);
                  Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                  }).start(() => setActiveModal(null));
                }}
                style={[
                  styles.sheetItem,
                  {
                    backgroundColor: selectedActivity === act.id
                      ? (colorScheme === "dark" ? "rgba(91, 157, 254, 0.15)" : "rgba(91, 157, 254, 0.08)")
                      : color.cardBackground,
                    borderBottomColor: colorScheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  },
                ]}
              >
                <View style={styles.sheetActivityIcon}>
                  <Ionicons name={act.icon} size={20} color="#5B9DFE" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sheetItemTitle, { color: color.text }]}>
                    {act.name}
                  </Text>
                  <Text style={[styles.sheetItemSubtext, { color: color.textSecondary }]}>
                    {act.pointsPerHour} pts/hr
                  </Text>
                </View>
                {selectedActivity === act.id && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={20} color="#5B9DFE" />
                  </View>
                )}
              </TouchableOpacity>
            )}
            style={{ backgroundColor: color.cardBackground }}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );

  // Team Modal Component
  const TeamModal = () => (
    <Modal
      visible={activeModal === "team"}
      transparent
      animationType="none"
      onRequestClose={() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setActiveModal(null));
      }}
    >
      <TouchableOpacity
        style={styles.iOSOverlay}
        activeOpacity={1}
        onPress={() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setActiveModal(null));
        }}
      >
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.sheetHeader, { backgroundColor: color.cardBackground }]}>
            <View style={styles.dragHandle} />
            <Text style={[styles.sheetTitle, { color: color.text }]}>Select Team</Text>
          </View>
          <FlatList
            data={teams}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={true}
            renderItem={({ item: t }) => (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setSelectedTeamId(t.id);
                  setSelectedMembers([]);
                  Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                  }).start(() => setActiveModal(null));
                }}
                style={[
                  styles.sheetItem,
                  {
                    backgroundColor: String(selectedTeamId) === String(t.id)
                      ? (colorScheme === "dark" ? "rgba(91, 157, 254, 0.15)" : "rgba(91, 157, 254, 0.08)")
                      : color.cardBackground,
                    borderBottomColor: colorScheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  },
                ]}
              >
                <Text style={[styles.sheetItemTitle, { color: color.text, flex: 1 }]}>
                  {t.name}
                </Text>
                {String(selectedTeamId) === String(t.id) && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={20} color="#5B9DFE" />
                  </View>
                )}
              </TouchableOpacity>
            )}
            style={{ backgroundColor: color.cardBackground }}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );

  // Members Modal Component
  const MembersModal = () => (
    <Modal
      visible={activeModal === "members"}
      transparent
      animationType="none"
      onRequestClose={() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setActiveModal(null));
      }}
    >
      <TouchableOpacity
        style={styles.iOSOverlay}
        activeOpacity={1}
        onPress={() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setActiveModal(null));
        }}
      >
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.sheetHeader, { backgroundColor: color.cardBackground }]}>
            <View style={styles.dragHandle} />
            <Text style={[styles.sheetTitle, { color: color.text }]}>Select Members</Text>
          </View>
          <FlatList
            data={selectedTeam?.users || []}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            renderItem={({ item: member }) => {
              const isSelected = selectedMembers.some((u) => u.id === member.id);
              const memberName = memberProfiles[member.id]?.name || "Loading...";
              return (
                <TouchableOpacity
                  onPress={() => toggleMember(member)}
                  style={[
                    styles.sheetItem,
                    {
                      backgroundColor: isSelected
                        ? (colorScheme === "dark" ? "rgba(91, 157, 254, 0.15)" : "rgba(91, 157, 254, 0.08)")
                        : color.cardBackground,
                      borderBottomColor: colorScheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sheetItemTitle, { color: color.text }]}>
                      {memberName}
                    </Text>
                    <Text style={[styles.sheetItemSubtext, { color: color.textSecondary }]}>
                      {member.weeklyPoints || 0} pts this week
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark-circle" size={20} color="#5B9DFE" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
            style={{ backgroundColor: color.cardBackground }}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaProvider>
      <LinearGradient colors={color.backgroundGradient} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
          >
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="chevron-back" size={28} color={color.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: color.text }]}>Add Points</Text>
                <TouchableOpacity onPress={() => router.push("/pointsCalculator")}>
                  <Ionicons name="calculator" size={24} color={color.text} />
                </TouchableOpacity>
              </View>

              {/* Activity Type Selector */}
              <View style={styles.block}>
                <Text style={[styles.label, { color: color.text }]}>Activity Type</Text>
                <TouchableOpacity
                  onPress={() => openModal("activity")}
                  activeOpacity={0.7}
                  style={[styles.selectorButton, { backgroundColor: color.inputBackground }]}
                >
                  <View style={styles.selectorButtonContent}>
                    {ACTIVITIES.find((a) => a.id === selectedActivity) && (
                      <Ionicons
                        name={ACTIVITIES.find((a) => a.id === selectedActivity).icon}
                        size={20}
                        color="#5B9DFE"
                        style={{ marginRight: 10 }}
                      />
                    )}
                    <Text style={[styles.selectorButtonText, { color: color.text }]}>
                      {ACTIVITIES.find((a) => a.id === selectedActivity)?.name || "Select Activity"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={color.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Team Selector */}
              <View style={styles.block}>
                <Text style={[styles.label, { color: color.text }]}>Team</Text>
                <TouchableOpacity
                  onPress={() => openModal("team")}
                  activeOpacity={0.7}
                  style={[styles.selectorButton, { backgroundColor: color.inputBackground }]}
                >
                  <Text style={[styles.selectorButtonText, { color: color.text }]}>
                    {selectedTeam?.name || "Select Team"}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={color.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Members Selector */}
              {selectedTeam && (
                <View style={styles.block}>
                  <Text style={[styles.label, { color: color.text }]}>Team Members</Text>
                  <TouchableOpacity
                    onPress={() => openModal("members")}
                    activeOpacity={0.7}
                    style={[styles.selectorButton, { backgroundColor: color.inputBackground }]}
                  >
                    <Text style={[styles.selectorButtonText, { color: color.text }]}>
                      {selectedMembers.length > 0
                        ? `${selectedMembers.length} selected`
                        : "Select Members"}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={color.textSecondary} />
                  </TouchableOpacity>

                  {/* Selected Members Display */}
                  {selectedMembers.length > 0 && (
                    <View style={styles.selectedMembersContainer}>
                      {selectedMembers.map((member) => {
                        const memberName = memberProfiles[member.id]?.name || "Loading...";
                        return (
                          <View
                            key={member.id}
                            style={[styles.memberBadge, { backgroundColor: "#5B9DFE20" }]}
                          >
                            <Text style={[styles.memberBadgeText, { color: color.text }]}>
                              {memberName}
                            </Text>

                            <TouchableOpacity onPress={() => toggleMember(member)}>
                              <Ionicons name="close-circle" size={16} color="#5B9DFE" />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}

              {/* Hours Input */}
              <View style={styles.block}>
                <Text style={[styles.label, { color: color.text }]}>Hours</Text>
                <TextInput
                  value={hours}
                  onChangeText={(t) => setHours(t.replace(/[^0-9.]/g, ""))}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 2.5"
                  placeholderTextColor={color.subtleText}
                  style={[
                    styles.input,
                    { color: color.text, backgroundColor: color.inputBackground },
                  ]}
                />
              </View>

              {/* Description Input */}
              <View style={styles.block}>
                <Text style={[styles.label, { color: color.text }]}>Description</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="What did they accomplish?"
                  placeholderTextColor={color.subtleText}
                  multiline
                  numberOfLines={3}
                  style={[
                    styles.input,
                    styles.textArea,
                    { color: color.text, backgroundColor: color.inputBackground },
                  ]}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                disabled={submitting}
                onPress={submit}
                activeOpacity={0.9}
                style={styles.submitButtonContainer}
              >
                <LinearGradient colors={gradient} style={styles.submitBtn}>
                  <Text style={styles.submitText}>{submitting ? "Saving…" : "Add Points"}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Modals */}
          <ActivityModal />
          <TeamModal />
          <MembersModal />
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  block: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  selectorButton: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectorButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  selectedMembersContainer: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  memberBadgeText: {
    fontSize: 13,
    fontWeight: "500",
  },
  submitButtonContainer: {
    marginHorizontal: 20,
    marginTop: "auto",
  },
  submitBtn: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.4)",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  iOSOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  bottomSheet: {
    maxHeight: "85%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  sheetHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    alignItems: "center",
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.15)",
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderBottomWidth: 0.5,
  },
  sheetActivityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(91, 157, 254, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  sheetItemTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  sheetItemSubtext: {
    fontSize: 13,
    fontWeight: "400",
    marginTop: 3,
  },
  checkmark: {
    marginLeft: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  modalItemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalItemSubtext: {
    fontSize: 13,
    fontWeight: "400",
    marginTop: 4,
  },
  activityItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});