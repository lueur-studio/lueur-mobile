import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable, Text, View } from "react-native";

const QRButton = () => {
  return (
    <Pressable
      className={`
        flex-row items-center gap-3 p-4 rounded-xl
        border border-ui-border dark:border-dark-border
        bg-ui-surfaceHover dark:bg-dark-surfaceHover
        active:opacity-85
      `}
      onPress={() => Alert.alert("Camera coming soon", "The QR scanner is being wired up with the camera team.")}
    >
      <View className="text-text-main dark:text-dark-text">
        <MaterialCommunityIcons name="camera" size={22} color="currentColor" />
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-semibold text-text-main dark:text-dark-text">Scan QR code</Text>
        <Text className="text-text-muted dark:text-dark-text-muted text-sm">
          Opens your camera to scan an event invite
        </Text>
      </View>
    </Pressable>
  );
};

export default QRButton;
