import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, TextInput, View } from "react-native";

type TJoinEventModalProps = {
  visible: boolean;
  onClose: () => void;
  onJoinLink: (link: string) => void;
  palette: (typeof Colors)["light"];
  colorScheme: "light" | "dark";
};

export function JoinEventModal({ visible, onClose, onJoinLink, palette, colorScheme }: TJoinEventModalProps) {
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setInviteLink("");
      setError(null);
    }
  }, [visible]);

  const placeholderColor = "#94A3B8";

  const handleLinkJoin = () => {
    if (!inviteLink.trim()) {
      setError("Please paste the invitation URL.");
      return;
    }
    onJoinLink(inviteLink.trim());
  };

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View className="flex-1 items-center justify-center bg-black/40">
        <View className={`w-[90%] rounded-2xl p-6 gap-6 ${colorScheme === "dark" ? "bg-[#181a1f]" : "bg-white"}`}>
          {/* Header */}
          <View className="gap-1">
            <ThemedText type="subtitle">Join an event</ThemedText>
            <ThemedText className="text-gray-500 dark:text-gray-300">
              Choose how you&apos;d like to join the event shared with you.
            </ThemedText>
          </View>

          {/* QR Button */}
          <Pressable
            className={`flex-row items-center gap-3 p-4 rounded-xl border ${
              colorScheme === "dark" ? "border-white/10" : "border-slate-900/10"
            }`}
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

          {/* Paste link */}
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
              className={`w-full px-4 py-3 rounded-xl border text-base ${
                colorScheme === "dark" ? "border-white/10" : "border-slate-900/10"
              }`}
              style={{
                color: palette.text,
              }}
            />

            {error ? <ThemedText className="text-red-500">{error}</ThemedText> : null}

            {/* Join Button */}
            <Pressable
              className="w-full items-center justify-center rounded-xl py-3"
              style={{ backgroundColor: palette.tint }}
              onPress={handleLinkJoin}
            >
              <ThemedText type="defaultSemiBold" lightColor="#fff" darkColor="#fff">
                Join with link
              </ThemedText>
            </Pressable>
          </View>

          {/* Close */}
          <Pressable className="items-center py-2" onPress={onClose}>
            <ThemedText type="link">Cancel</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
