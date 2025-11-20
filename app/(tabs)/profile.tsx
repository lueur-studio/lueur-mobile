import * as ImagePicker from "expo-image-picker";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ComponentProps, useCallback, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ProfileState = {
  email: string;
  displayName: string;
  photoUrl?: string;
};

const MOCK_PROFILE: ProfileState = {
  email: "creative@lueur.app",
  displayName: "Lueur Creator",
  photoUrl: undefined,
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState(MOCK_PROFILE.email);
  const [displayName, setDisplayName] = useState(MOCK_PROFILE.displayName);
  const [photo, setPhoto] = useState<string | undefined>(MOCK_PROFILE.photoUrl);
  const [isSaving, setIsSaving] = useState(false);

  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }, [displayName]);

  const requestPermission = useCallback(async (type: "camera" | "library") => {
    if (type === "camera") {
      const result = await ImagePicker.requestCameraPermissionsAsync();
      if (result.status !== ImagePicker.PermissionStatus.GRANTED) {
        Alert.alert(
          "Camera permission needed",
          "Please allow camera access to take a profile photo.",
        );
        return false;
      }
    } else {
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (result.status !== ImagePicker.PermissionStatus.GRANTED) {
        Alert.alert(
          "Photo library permission needed",
          "Please allow access so we can pick an image from your gallery.",
        );
        return false;
      }
    }
    return true;
  }, []);

  const handlePickFromLibrary = useCallback(async () => {
    if (!(await requestPermission("library"))) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0]?.uri);
    }
  }, [requestPermission]);

  const handleTakePhoto = useCallback(async () => {
    if (!(await requestPermission("camera"))) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0]?.uri);
    }
  }, [requestPermission]);

  const handleChangePhoto = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "Update photo",
          options: ["Cancel", "Take photo", "Choose from library"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleTakePhoto();
          } else if (buttonIndex === 2) {
            handlePickFromLibrary();
          }
        },
      );
      return;
    }

    Alert.alert("Update photo", "Choose how to update your avatar.", [
      { text: "Cancel", style: "cancel" },
      { text: "Take photo", onPress: handleTakePhoto },
      { text: "Choose from library", onPress: handlePickFromLibrary },
    ]);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        "Profile saved",
        "Changes are cached locally until the profile API is wired up.",
      );
    }, 800);
  };

  const inputBackground =
    colorScheme === "dark" ? "rgba(255,255,255,0.08)" : "#f4f4f5";

  return (
    <ThemedView className="flex-1">
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: Math.max(insets.top + 12, 32),
            paddingBottom: Math.max(insets.bottom + 24, 40),
          },
        ]}
      >
        <View className="gap-2">
          <ThemedText type="title">Your profile</ThemedText>
          <ThemedText className="text-gray-500 dark:text-gray-300">
            Edit your contact info and avatar while backend work continues.
          </ThemedText>
        </View>

        <View style={styles.card}>
          <Pressable
            accessibilityRole="button"
            onPress={handleChangePhoto}
            style={({ pressed }) => [
              styles.avatarButton,
              pressed && styles.pressed,
              {
                backgroundColor:
                  colorScheme === "dark" ? "rgba(255,255,255,0.08)" : "#e4e4e7",
              },
            ]}
          >
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatarImage} />
            ) : (
              <View style={styles.initialsCircle}>
                <ThemedText
                  type="title"
                  lightColor={palette.text}
                  darkColor={palette.text}
                >
                  {initials || "?"}
                </ThemedText>
              </View>
            )}
            <View style={styles.avatarOverlay}>
              <ThemedText
                type="defaultSemiBold"
                lightColor="#fff"
                darkColor="#fff"
              >
                Change photo
              </ThemedText>
            </View>
          </Pressable>
          <ThemedText className="text-gray-500 dark:text-gray-300 text-center">
            Tap the avatar to take a new picture or pick one from your gallery.
          </ThemedText>
        </View>

        <View style={styles.card}>
          <ProfileField
            label="Display name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="How people see you"
            backgroundColor={inputBackground}
            textColor={palette.text}
          />
          <ProfileField
            label="Email address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            backgroundColor={inputBackground}
            textColor={palette.text}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleSave}
          disabled={isSaving}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: palette.tint,
              opacity: isSaving ? 0.6 : pressed ? 0.9 : 1,
            },
          ]}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText
              type="defaultSemiBold"
              lightColor="#fff"
              darkColor="#fff"
            >
              Save changes
            </ThemedText>
          )}
        </Pressable>

        <View style={styles.hintCard}>
          <ThemedText type="defaultSemiBold">Heads up</ThemedText>
          <ThemedText className="text-gray-500 dark:text-gray-300">
            This screen currently mocks the profile service. Once the API lands,
            taps on the save button will push these values to your account.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

type ProfileFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  backgroundColor: string;
  textColor: string;
};

function ProfileField({
  label,
  value,
  onChangeText,
  backgroundColor,
  textColor,
  ...rest
}: ProfileFieldProps & ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.fieldGroup}>
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          {
            backgroundColor,
            color: textColor,
          },
        ]}
        placeholderTextColor="rgba(148, 163, 184, 0.8)"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    gap: 20,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    gap: 12,
    backgroundColor: "rgba(148,163,184,0.1)",
  },
  avatarButton: {
    width: 140,
    height: 140,
    borderRadius: 999,
    alignSelf: "center",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  initialsCircle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pressed: {
    opacity: 0.85,
  },
  fieldGroup: {
    gap: 8,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  hintCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.3)",
    padding: 16,
    gap: 6,
  },
});
