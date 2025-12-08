import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { theme } from "../theme/colors";

export default function TeamCard({ item, onPress }) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? theme.dark : theme.light;

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
        style={{ marginBottom: 14 }}
      >
        <LinearGradient
          colors={palette.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { shadowColor: palette.shadow }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.teamName, { color: palette.text }]}>
              {item.name}
            </Text>
            <Text
              style={[styles.memberCount, { color: palette.textSecondary }]}
            >
              {item.users?.length || 0} members
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color={palette.textSecondary}
          />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",

    // Better premium shadows
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: Platform.OS === "android" ? 5 : 0,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "700",
  },
  memberCount: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },
});
