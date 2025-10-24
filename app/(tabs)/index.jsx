import { LinearGradient } from "expo-linear-gradient";
import { useContext } from "react";
import { ActivityIndicator, Text, useColorScheme, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { authStyles as styles } from "../../styles/authStyles";
import { theme } from "../../theme/colors";

export default function Index() {
  const { userData, isLoading } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === "dark" ? "dark" : "light"];

  if (isLoading || !userData) {
    return (
      <View style={[style.gradientBg, { backgroundColor: colors.inputBackground }]}>
        <ActivityIndicator size="large" color={colors.buttonGradient[0]} />
      </View>
    );
  }

  return (
     <LinearGradient
        colors={colors.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBg}
      >
        <View style={styles.innerContainer}>
          <Text style={[styles.title, { color: colors.text }]}> Welcome, {userData.name}!</Text>
    </View>
      </LinearGradient>
    
  );
}
