import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function TeamCard({ item, onPress }) {
  const colorScheme = useColorScheme(); // detect light/dark
  const themeColors = colorScheme === "dark" ? require("../theme/colors").theme.dark : require("../theme/colors").theme.light;

  if (!item || !item.id) return null; // Prevent empty cards

  const scale = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
    Haptics.selectionAsync();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: themeColors.inputBackground,
            shadowColor: themeColors.shadow,
          },
        ]}
        activeOpacity={0.7}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.teamName, { color: themeColors.text }]}>{item.name}</Text>
          <Text style={[styles.memberCount, { color: themeColors.textSecondary }]}>
            {item.users?.length || 0} members
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 18,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: Platform.OS === "android" ? 2 : 0,
    flexDirection: "row",
    alignItems: "center",
  },
  teamName: {
    fontSize: 17,
    fontWeight: "600",
  },
  memberCount: {
    marginTop: 4,
    fontSize: 14,
  },
});
