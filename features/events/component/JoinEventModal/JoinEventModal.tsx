import { ThemedText } from "@/components/themed-text";
import PrimaryButton from "@/components/ui/AppButton/PrimaryButton/PrimaryButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type JoinEventModalProps = {
  visible: boolean;
  onClose: () => void;
  onJoinLink: (link: string) => void;
  palette: { tint: string; text: string };
  colorScheme: "light" | "dark";
};

export default function JoinEventModal({ visible, onClose, onJoinLink, palette, colorScheme }: JoinEventModalProps) {
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setInviteLink("");
      setError(null);
    }
  }, [visible]);

  const handleLinkJoin = () => {
    if (!inviteLink.trim()) {
      setError("Please paste the invitation URL.");
      return;
    }
    onJoinLink(inviteLink.trim());
  };

  const placeholderColor = colorScheme === "dark" ? "#94A3B8" : "#94A3B8";

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modal,
            { "--tint": palette.tint } as any,
            { backgroundColor: colorScheme === "dark" ? "#181a1f" : "#fff" },
          ]}
          className="p-6 gap-5"
        >
          {/* HEADER */}
          <View className="gap-1">
            <ThemedText type="subtitle">Join an event</ThemedText>
            <ThemedText className="text-gray-500 dark:text-gray-300">
              Choose how you'd like to join the event shared with you.
            </ThemedText>
          </View>

          {/* QR BUTTON */}
          <Pressable
            className="flex-row items-center gap-3 p-4 rounded-xl border active:opacity-85"
            style={[
              {
                borderColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)",
              },
            ]}
            onPress={() => Alert.alert("Camera coming soon", "The QR scanner is being wired up with the camera team.")}
          >
            <MaterialCommunityIcons name="camera" size={22} color={palette.tint} />
            <View className="flex-1">
              <ThemedText type="defaultSemiBold">Scan QR code</ThemedText>
              <ThemedText className="text-gray-500 dark:text-gray-300">
                Opens your camera to scan an event invite.
              </ThemedText>
            </View>
          </Pressable>

          {/* INPUT BLOCK */}
          <View className="gap-2">
            <ThemedText type="defaultSemiBold">Or paste the invite link</ThemedText>

            <TextInput
              value={inviteLink}
              onChangeText={(text) => {
                setInviteLink(text);
                setError(null);
              }}
              placeholder="https://events.lueur.app/invite/ABC123"
              placeholderTextColor={placeholderColor}
              autoCapitalize="none"
              autoCorrect={false}
              className="border rounded-xl px-4 py-3 text-base"
              style={{
                borderColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)",
                color: palette.text,
              }}
            />

            {error ? <ThemedText className="text-red-500">{error}</ThemedText> : null}

            {/* JOIN BUTTON */}
            <PrimaryButton text="Join with Link" onPress={handleLinkJoin} />
          </View>

          {/* CANCEL */}
          <Pressable className="items-center active:opacity-85" onPress={onClose}>
            <ThemedText type="link">Cancel</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modal: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
});
