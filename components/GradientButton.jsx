import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function GradientButton({ onPress, title, colors = ["#2563EB", "#5B9DFE"], disabled = false }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[s.wrapper, disabled && { opacity: 0.6 }]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.button}>
        <Text style={s.btnText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    width: "100%",
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
