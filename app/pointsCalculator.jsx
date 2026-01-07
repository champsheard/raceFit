import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { theme } from "../theme/colors";
import { ACTIVITIES, calculatePoints } from "../utils/activities";

export default function PointsCalculatorScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? theme.dark : theme.light;

  const [selectedActivity, setSelectedActivity] = useState("running");
  const [hours, setHours] = useState("");
  const [activityDropdownOpen, setActivityDropdownOpen] = useState(false);

  const activity = ACTIVITIES.find((a) => a.id === selectedActivity);
  const calculatedPoints = hours ? calculatePoints(selectedActivity, hours) : 0;

  const fabGradient = colorScheme === "dark" ? ["#5B9DFE", "#2563EB"] : color.buttonGradient;

  return (
    <SafeAreaProvider>
      <LinearGradient colors={color.backgroundGradient} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={28} color={color.text} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: color.text }]}>
                Points Calculator
              </Text>
              <View style={{ width: 28 }} />
            </View>

            <View style={styles.contentContainer}>
              {/* Activity Selector */}
              <View style={styles.block}>
                <Text style={[styles.label, { color: color.text }]}>Activity Type</Text>
                <TouchableOpacity
                  onPress={() => setActivityDropdownOpen(!activityDropdownOpen)}
                  style={[styles.dropdownButton, { backgroundColor: color.inputBackground }]}
                >
                  <View style={styles.activityButtonContent}>
                    <Ionicons
                      name={activity?.icon}
                      size={20}
                      color={color.text}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[styles.dropdownButtonText, { color: color.text }]}>
                      {activity?.name}
                    </Text>
                  </View>
                  <Ionicons
                    name={activityDropdownOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={color.text}
                  />
                </TouchableOpacity>
                {activityDropdownOpen && (
                  <View
                    style={[
                      styles.dropdownList,
                      { backgroundColor: color.cardBackground, borderColor: color.textSecondary },
                    ]}
                  >
                    {ACTIVITIES.map((act) => (
                      <TouchableOpacity
                        key={act.id}
                        onPress={() => {
                          setSelectedActivity(act.id);
                          setActivityDropdownOpen(false);
                        }}
                        style={[
                          styles.dropdownItem,
                          selectedActivity === act.id && {
                            backgroundColor: `${"#5B9DFE"}20`,
                          },
                        ]}
                      >
                        <View style={styles.activityItemContent}>
                          <Ionicons name={act.icon} size={18} color={color.text} />
                          <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={[styles.dropdownItemText, { color: color.text }]}>
                              {act.name}
                            </Text>
                            <Text style={[styles.activitySubtext, { color: color.textSecondary }]}>
                              {act.pointsPerHour} pts/hr
                            </Text>
                          </View>
                        </View>
                        {selectedActivity === act.id && (
                          <Ionicons name="checkmark-circle" size={20} color="#5B9DFE" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Activity Info */}
              {activity && (
                <View style={[styles.infoBox, { backgroundColor: `${"#5B9DFE"}15` }]}>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: color.text }]}>
                      Points per hour:
                    </Text>
                    <Text style={[styles.infoValue, { color: color.text }]}>
                      {activity.pointsPerHour} pts
                    </Text>
                  </View>
                  <Text style={[styles.infoDescription, { color: color.textSecondary }]}>
                    {activity.description}
                  </Text>
                </View>
              )}

              {/* Hours Input */}
              <View style={styles.block}>
                <Text style={[styles.label, { color: color.text }]}>Hours Spent</Text>
                <TextInput
                  value={hours}
                  onChangeText={(t) => setHours(t.replace(/[^0-9.]/g, ""))}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 1.5"
                  placeholderTextColor={color.subtleText}
                  style={[styles.input, { color: color.text, backgroundColor: color.inputBackground }]}
                />
              </View>

              {/* Points Calculation Display */}
              <View
                style={[
                  styles.calculationBox,
                  { backgroundColor: color.cardBackground, borderColor: "#5B9DFE" },
                ]}
              >
                <View style={styles.calculationRow}>
                  <Text style={[styles.calculationLabel, { color: color.textSecondary }]}>
                    Activity:
                  </Text>
                  <Text style={[styles.calculationValue, { color: color.text }]}>
                    {activity?.name}
                  </Text>
                </View>
                <View style={styles.calculationRow}>
                  <Text style={[styles.calculationLabel, { color: color.textSecondary }]}>
                    Hours:
                  </Text>
                  <Text style={[styles.calculationValue, { color: color.text }]}>
                    {hours || "0"}
                  </Text>
                </View>
                <View style={styles.calculationRow}>
                  <Text style={[styles.calculationLabel, { color: color.textSecondary }]}>
                    Points/Hour:
                  </Text>
                  <Text style={[styles.calculationValue, { color: color.text }]}>
                    {activity?.pointsPerHour}
                  </Text>
                </View>

                <View
                  style={[
                    styles.calculationDivider,
                    { backgroundColor: color.textSecondary },
                  ]}
                />

                <View style={styles.calculationRow}>
                  <Text style={[styles.totalLabel, { color: color.text }]}>Total Points:</Text>
                  <Text style={[styles.totalValue, { color: "#5B9DFE" }]}>
                    {calculatedPoints}
                  </Text>
                </View>
              </View>

              {/* Formula Display */}
              <View style={[styles.formulaBox, { backgroundColor: `${color.textSecondary}10` }]}>
                <Text style={[styles.formulaTitle, { color: color.text }]}>Formula</Text>
                <Text style={[styles.formula, { color: color.textSecondary }]}>
                  {activity?.pointsPerHour} pts/hr × {hours || "0"} hrs = {calculatedPoints} pts
                </Text>
              </View>

              <View style={{ height: 20 }} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  block: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  dropdownButton: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownList: {
    borderRadius: 14,
    marginTop: 8,
    borderWidth: 1,
    maxHeight: 300,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  activityItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: "500",
  },
  activitySubtext: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 2,
  },
  infoBox: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#5B9DFE",
  },
  infoDescription: {
    fontSize: 13,
    fontWeight: "400",
    marginTop: 8,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  calculationBox: {
    borderRadius: 14,
    borderWidth: 2,
    padding: 16,
    marginBottom: 20,
  },
  calculationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  calculationLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  calculationValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  calculationDivider: {
    height: 1,
    marginVertical: 12,
    opacity: 0.3,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  formulaBox: {
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  formulaTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  formula: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
