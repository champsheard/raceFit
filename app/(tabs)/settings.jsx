import { LinearGradient } from "expo-linear-gradient";
import { useContext } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { authStyles as styles } from "../../styles/authStyles";
import { theme } from "../../theme/colors";
export default function Settings() {
  const { logout } = useContext(AuthContext);

    const colorScheme = useColorScheme();
    const colors = theme[colorScheme === "dark" ? "dark" : "light"];
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Settings Page</Text>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.button, { shadowColor: colors.shadow }]}
        onPress={() => logout()}
      >
        <LinearGradient
          colors={colors.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
