import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, useColorScheme } from "react-native";
import { createComponentStyles } from "../styles/componentStyles";
import { theme } from "../theme/colors";
import { designSystem } from "../theme/designSystem";

export default function GradientButton({ onPress, title, colors = null, disabled = false }) {
  const colorScheme = useColorScheme();
  const themeColors = theme[colorScheme === "dark" ? "dark" : "light"];
  const styles = createComponentStyles(themeColors);
  
  const gradientColors = colors || themeColors.buttonGradient;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[s.wrapper, disabled && styles.disabledOpacity]}>
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.buttonPrimary}>
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  wrapper: {
    marginTop: designSystem.spacing.lg,
    width: "100%",
  },
});
