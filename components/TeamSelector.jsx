import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { theme } from "../theme/colors";
import { designSystem } from "../theme/designSystem";

export default function TeamSelector({ teams, selectedTeamId, onSelectTeam }) {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? theme.dark : theme.light;
  const [modalVisible, setModalVisible] = useState(false);

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  const handleSelectTeam = useCallback(
    (teamId) => {
      Haptics.selectionAsync();
      onSelectTeam(teamId);
      setModalVisible(false);
    },
    [onSelectTeam]
  );

  return (
    <View>
      {/* Team Selector Button */}
      <TouchableOpacity
        style={s.selectorButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setModalVisible(true);
        }}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={colorScheme === "dark" ? ["#5B9DFE", "#2563EB"] : color.buttonGradient}
          style={s.selectorGradient}
        >
          <View style={s.selectorContent}>
            <View>
              <Text style={s.selectorLabel}>Current Team</Text>
              <Text style={s.selectorTeamName}>
                {selectedTeam?.name || "Select Team"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#fff" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Team Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={s.backdrop}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        />
        <View style={s.modalContainer}>
          <View
            style={[
              s.modalContent,
              { backgroundColor: color.cardBackground },
            ]}
          >
            <Text style={[s.modalTitle, { color: color.text }]}>
              Select Team
            </Text>

            <FlatList
              data={teams}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={teams.length > 4}
              maxToRenderPerBatch={10}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    s.teamOption,
                    selectedTeamId === item.id && s.teamOptionSelected,
                    selectedTeamId === item.id && {
                      backgroundColor: `${color.buttonGradient?.[0]}20`,
                    },
                  ]}
                  onPress={() => handleSelectTeam(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={s.teamOptionContent}>
                    <Text
                      style={[
                        s.teamOptionName,
                        { color: color.text },
                        selectedTeamId === item.id && s.teamOptionNameActive,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        s.teamOptionMembers,
                        { color: color.textSecondary },
                      ]}
                    >
                      {item.users?.length || 0} members
                    </Text>
                  </View>
                  {selectedTeamId === item.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={color.buttonGradient?.[0]}
                    />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    s.separator,
                    { backgroundColor: `${color.textSecondary}20` },
                  ]}
                />
              )}
            />

            <TouchableOpacity
              style={s.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[s.closeButtonText, { color: color.text }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  selectorButton: {
    marginHorizontal: designSystem.spacing.xl,
    marginBottom: designSystem.spacing.md,
  },
  selectorGradient: {
    borderRadius: designSystem.borderRadius.md,
    paddingVertical: designSystem.spacing.md,
    paddingHorizontal: designSystem.spacing.md,
    ...designSystem.shadows.md,
  },
  selectorContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorLabel: {
    color: "rgba(255,255,255,0.8)",
    ...designSystem.typography.labelXS,
    marginBottom: designSystem.spacing.xs,
  },
  selectorTeamName: {
    color: "#fff",
    ...designSystem.typography.titleMD,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: designSystem.spacing.xl,
  },
  modalContent: {
    borderRadius: designSystem.borderRadius.lg,
    paddingVertical: designSystem.spacing.xl,
    maxHeight: "70%",
    width: "100%",
  },
  modalTitle: {
    ...designSystem.typography.titleMD,
    paddingHorizontal: designSystem.spacing.md,
    marginBottom: designSystem.spacing.md,
  },
  teamOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: designSystem.spacing.md,
    paddingHorizontal: designSystem.spacing.md,
  },
  teamOptionSelected: {
    borderRadius: designSystem.borderRadius.md,
  },
  teamOptionContent: {
    flex: 1,
  },
  teamOptionName: {
    ...designSystem.typography.bodyMD,
  },
  teamOptionNameActive: {
    fontWeight: "700",
  },
  teamOptionMembers: {
    ...designSystem.typography.bodyXS,
    marginTop: designSystem.spacing.xs,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  closeButton: {
    marginTop: designSystem.spacing.md,
    paddingVertical: designSystem.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  closeButtonText: {
    textAlign: "center",
    ...designSystem.typography.bodyMD,
    fontWeight: "600",
  },
});
