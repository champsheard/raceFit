import { StyleSheet, Text, TextInput, View, useColorScheme } from "react-native";
import { createComponentStyles } from "../styles/componentStyles";
import { theme } from "../theme/colors";

export default function FormInput({ label, value, onChangeText, placeholder, keyboardType = "default", multiline = false }) {
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === "dark" ? "dark" : "light"];
  const styles = createComponentStyles(colors);

  return (
    <View style={s.wrapper}>
      <Text style={[styles.label]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline && s.textArea]}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});
