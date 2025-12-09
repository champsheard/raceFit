import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { TeamContext } from "../../context/TeamProvider";
import { authStyles } from "../../styles/authStyles";
import { theme } from "../../theme/colors";
import { IMGBB_API_KEY } from "../../utils/config";

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? theme.dark : theme.light;

  const { userData, logout, updateUserProfile, isLoading } =
    useContext(AuthContext);

  const { getTeams, teams } = useContext(TeamContext);

  const [fullName, setFullName] = useState(userData?.name || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [defaultTeam, setDefaultTeam] = useState(userData?.defaultTeam || "");
  const [bio, setBio] = useState(userData?.bio || "");
  const [birthday, setBirthday] = useState(
    userData?.birthday ? new Date(userData.birthday) : new Date()
  );
  const [tempBirthday, setTempBirthday] = useState(birthday);
  const [newPassword, setNewPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(userData?.profilePhoto || "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showTeamPicker, setShowTeamPicker] = useState(false);

  const today = new Date();
  const thirteenYearsAgo = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  );

  const pickAndUploadImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required", "Camera roll access is needed.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const imageUri = result.assets[0].uri;

      const compressedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 600 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );

      setUpdating(true);

      const formData = new FormData();
      formData.append("image", {
        uri: compressedImage.uri,
        type: "image/jpeg",
        name: "profile.jpg",
      });

      const uploadRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await uploadRes.json();
      if (data?.data?.url) {
        const newUrl = data.data.url;
        setProfilePhoto(newUrl);
        await updateUserProfile({ profilePhoto: newUrl });
      } else {
        console.error("ImgBB response:", data);
        Alert.alert("Error", "Failed to upload image.");
      }
    } catch (error) {
      console.error("ImgBB upload error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSave = async () => {
    setUpdating(true);
    try {
      await updateUserProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        defaultTeam: defaultTeam.trim(),
        bio: bio.trim(),
        birthday: tempBirthday.toISOString(),
        newPassword: newPassword.trim(),
        profilePhoto,
      });
      setBirthday(tempBirthday);
      Alert.alert("Saved", "Your profile was updated successfully.");
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setUpdating(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout },
      ]
    );
  };

  return (
    <LinearGradient
      colors={palette.backgroundGradient}
      style={[authStyles.container, { paddingHorizontal: 20 }]}
    >
      {/* Floating Back Button
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: Platform.OS === "ios" ? 60 : 40,
          left: 20,
          zIndex: 50,
          backgroundColor: palette.card + "CC",
          borderRadius: 25,
          padding: 10,
          shadowColor: palette.shadow,
          shadowOpacity: 0.3,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 3 },
          elevation: 5,
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={24} color={palette.text} />
      </TouchableOpacity> */}

      {/* Floating Logout Button */}
      <TouchableOpacity
        onPress={confirmLogout}
        style={{
          position: "absolute",
          top: Platform.OS === "ios" ? 60 : 40,
          right: 20,
          zIndex: 50,
          backgroundColor: palette.card + "CC",
          borderRadius: 25,
          padding: 10,
          shadowColor: palette.shadow,
          shadowOpacity: 0.3,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 3 },
          elevation: 5,
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={24} color={palette.text} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 100 }}>
        <View>
          <Text
            style={[
              authStyles.title,
              {
                color: palette.text,
                textAlign: "center",
                marginBottom: 20,
                fontSize: 28,
                fontWeight: "700",
              },
            ]}
          >
            Settings
          </Text>

          {/* Profile Image */}
          <TouchableOpacity
            onPress={pickAndUploadImage}
            style={{ alignSelf: "center" }}
            activeOpacity={0.8}
          >
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  marginVertical: 15,
                  shadowColor: palette.shadow,
                  shadowOpacity: 0.4,
                  shadowOffset: { width: 0, height: 3 },
                  shadowRadius: 6,
                }}
              />
            ) : (
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  marginVertical: 15,
                  backgroundColor: palette.card,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: palette.inputBorder,
                }}
              >
                <Ionicons
                  name="camera-outline"
                  size={30}
                  color={palette.textSecondary}
                />
                <Text
                  style={{ color: palette.textSecondary, fontSize: 12, marginTop: 4 }}
                >
                  Add Photo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Inputs */}
          <View style={{ gap: 10 }}>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={palette.placeholder}
              value={fullName}
              onChangeText={setFullName}
              style={[authStyles.input, { borderColor: palette.inputBorder, color: palette.text }]}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor={palette.placeholder}
              value={email}
              onChangeText={setEmail}
              style={[authStyles.input, { borderColor: palette.inputBorder, color: palette.text }]}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {/* Birthday Selector */}
            <TouchableOpacity
              onPress={() => setShowDatePicker(!showDatePicker)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderColor: palette.inputBorder,
                borderWidth: 1,
                borderRadius: 10,
                padding: 14,
                backgroundColor: palette.card,
              }}
            >
              <Text style={{ color: palette.text, fontWeight: "600" }}>
                {tempBirthday.toDateString()}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={22}
                color={palette.textSecondary}
              />
            </TouchableOpacity>

            {showDatePicker && (
              <View style={{ marginVertical: 5 }}>
                <DateTimePicker
                  value={tempBirthday}
                  mode="date"
                  display="spinner"
                  onChange={(e, d) => d && setTempBirthday(d)}
                  maximumDate={thirteenYearsAgo}
                  minimumDate={new Date(1900, 0, 1)}
                />
              </View>
            )}
            {/* DEFAULT TEAM */}
            <TouchableOpacity
              onPress={() => setShowTeamPicker(!showTeamPicker)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderColor: palette.inputBorder,
                borderWidth: 1,
                borderRadius: 10,
                padding: 14,
                backgroundColor: palette.card,
                marginTop: 10,
              }}
            >
              <Text style={{ color: defaultTeam ? palette.text : palette.placeholder, fontWeight: "600" }}>
                {defaultTeam
                  ? teams.find((t) => t.id === defaultTeam)?.name
                  : "Select a Default Team"}
              </Text>
              <Ionicons
                name={showTeamPicker ? "chevron-up-outline" : "chevron-down-outline"}
                size={22}
                color={palette.textSecondary}
              />
            </TouchableOpacity>

            {showTeamPicker && (
              <Picker
                selectedValue={defaultTeam}
                onValueChange={(value) => {
                  setDefaultTeam(value);
                  setShowTeamPicker(false); // close picker after selection
                }}
                style={[
                  authStyles.input,
                  {
                    borderColor: palette.inputBorder,
                    color: palette.text,
                    marginTop: 5,
                  },
                ]}
                dropdownIconColor={palette.text}
              >
                <Picker.Item
                  label="Select a Team"
                  value=""
                  color={palette.placeholder}
                />

                {teams.map((team) => (
                  <Picker.Item key={team.id} label={team.name} value={team.id} />
                ))}
              </Picker>
            )}


            <TextInput
              placeholder="Bio"
              placeholderTextColor={palette.placeholder}
              value={bio}
              onChangeText={setBio}
              style={[
                authStyles.input,
                {
                  height: 100,
                  textAlignVertical: "top",
                  borderColor: palette.inputBorder,
                  color: palette.text,
                },
              ]}
              multiline
            />
            <TextInput
              placeholder="New Password"
              placeholderTextColor={palette.placeholder}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              style={[authStyles.input, { borderColor: palette.inputBorder, color: palette.text }]}
            />
          </View>

          {/* Save Button */}
          <LinearGradient
            colors={palette.buttonGradient}
            style={[
              authStyles.button,
              { marginTop: 25, borderRadius: 14, overflow: "hidden" },
            ]}
          >
            <TouchableOpacity
              onPress={handleSave}
              disabled={updating || isLoading}
              style={{ paddingVertical: 14, alignItems: "center" }}
            >
              {updating || isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={authStyles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
