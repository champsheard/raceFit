import { StyleSheet, Text, TextInput, View } from "react-native";

export default function FormInput({ label, value, onChangeText, placeholder, keyboardType = "default", multiline = false }) {
  return (
    <View style={s.card}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        keyboardType={keyboardType}
        multiline={multiline}
        style={[s.input, multiline && s.textArea]}
      />
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#000",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});
