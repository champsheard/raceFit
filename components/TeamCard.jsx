import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import { createComponentStyles } from "../styles/componentStyles";
import { theme } from "../theme/colors";
import { designSystem } from "../theme/designSystem";

export default function TeamCard({ item, onPress }) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? theme.dark : theme.light;
  const styles = createComponentStyles(palette);

  if (!item || !item.id) return null;

  const scale = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
    Haptics.selectionAsync();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
  <Animated.View style={{ transform: [{ scale }] }}>
    <TouchableOpacity
      activeOpacity={0.85}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={{ marginBottom: designSystem.spacing.md }}
    >
      <View
        style={[
          s.card,
          { backgroundColor: palette.cardBackground, shadowColor: palette.shadow },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.titleMD, { color: palette.text }]}>
            {item.name}
          </Text>
          <Text style={[s.memberCount, { color: palette.textSecondary }]}>
            {item.users?.length || 0} members
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color={palette.textSecondary}
        />
      </View>
    </TouchableOpacity>
  </Animated.View>
);
}

const s = StyleSheet.create({
  card: {
    paddingVertical: designSystem.spacing.lg,
    paddingHorizontal: designSystem.spacing.xl,
    borderRadius: designSystem.card.borderRadius,
    flexDirection: "row",
    alignItems: "center",
    ...designSystem.shadows.lg,
  },
  memberCount: {
    marginTop: designSystem.spacing.xs,
    ...designSystem.typography.bodySM,
    opacity: 0.8,
  },
});
