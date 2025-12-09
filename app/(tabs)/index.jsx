import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AuthContext } from "../../context/AuthContext";
import { TeamContext } from "../../context/TeamProvider";
import { theme } from "../../theme/colors";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function TeamsScreen() {
  const { teams, getTeams } = useContext(TeamContext);
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? theme.dark : theme.light;

  const fabGradient = colorScheme === "dark" ? ["#5B9DFE", "#2563EB"] : color.buttonGradient;

  const [loading, setLoading] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeTeam, setActiveTeam] = useState(userData.defaultTeam || null);
  const [activeTeamName, setActiveTeamName] = useState(null)
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    const id = activeTeam;
    const team = teams.find(team => team.id === id);
    setActiveTeamName(team ? team.name : '');
  }, [activeTeam, teams]);


  // Open action sheet
  const openSheet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSheetVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // Close action sheet
  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => setSheetVisible(false));
  };

  // Fetch teams
  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      await getTeams();
    } finally {
      setLoading(false);
    }
  }, [getTeams]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return (
    <SafeAreaProvider>
      <LinearGradient colors={color.backgroundGradient} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <Text style={[styles.headerTitle, { color: color.text }]}>
            Hello {userData?.name || "User"}
          </Text>

          {/* Team Selection Button */}
          <TouchableOpacity onPress={openSheet} activeOpacity={0.9} style={{ marginHorizontal: 20 }}>
            <LinearGradient colors={fabGradient} style={styles.fab}>
              <Text style={{ color: "#fff" }}>{activeTeamName || "Select Team"}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Floating Action Button */}
          <TouchableOpacity
            style={styles.fabContainer}
            onPress={() => {
              console.log("FAB pressed");
            }}
            activeOpacity={0.9}
          >
            <LinearGradient colors={fabGradient} style={styles.fab}>
              <Ionicons name="add" size={32} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Action Sheet */}
          <Modal visible={sheetVisible} transparent animationType="fade" onRequestClose={closeSheet}>
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeSheet} />
            <Animated.View style={[styles.sheetContainer, { transform: [{ translateY: slideAnim }] }]}>
              <BlurView intensity={30} tint={colorScheme} style={[styles.sheet, { backgroundColor: color.inputBackground }]}>
                {loading ? (
                  <ActivityIndicator size="small" color={color.text} style={{ marginVertical: 10 }} />
                ) : (
                  <FlatList
                    data={teams}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.option}
                        onPress={async () => {
                          await Haptics.selectionAsync();
                          setActiveTeam(item.id);
                          closeSheet();
                        }}
                      >
                        <Text style={[styles.optionText, { color: color.text }]}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                  />
                )}
              </BlurView>

              <BlurView intensity={30} tint={colorScheme} style={[styles.cancelBlock, { backgroundColor: color.inputBackground }]}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={async () => {
                    await Haptics.selectionAsync();
                    closeSheet();
                  }}
                >
                  <Text style={[styles.cancelText, { color: color.text }]}>Cancel</Text>
                </TouchableOpacity>
              </BlurView>
            </Animated.View>
          </Modal>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 34,
    fontWeight: "700",
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 12,
  },
  fabContainer: {
    position: "absolute",
    bottom: 32,
    right: 24,
  },
  fab: {
    height: 60,
    width: "100%",
    maxWidth: 200,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.4)",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    paddingHorizontal: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheetContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 12,
    paddingBottom: 22,
  },
  sheet: {
    borderRadius: 16,
    overflow: "hidden",
  },
  option: {
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "500",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(150,150,150,0.3)",
  },
  cancelBlock: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
  },
  cancelBtn: {
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
