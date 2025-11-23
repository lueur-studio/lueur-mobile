import { ThemedText } from "@/components/themed-text";
import CancelButton from "@/components/ui/AppButton/CancelButton/CancelButton";
import PrimaryButton from "@/components/ui/AppButton/PrimaryButton/PrimaryButton";
import AppTextInput from "@/components/ui/AppTextInput/AppTextInput";
import { useEffect, useState } from "react";
import { Modal, View } from "react-native";
import QRButton from "../QRButton/QRButton";

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

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View className="flex-1 justify-end bg-black/45">
        <View className="p-6 gap-5 rounded-2xl p-4 bg-ui-background dark:bg-dark-background">
          <View className="gap-1">
            <ThemedText type="subtitle">Join an event</ThemedText>
            <ThemedText className="text-gray-500 dark:text-gray-300">
              Choose how you'd like to join the event shared with you.
            </ThemedText>
          </View>

          {/* QR BUTTON */}
          <QRButton />

          {/* INPUT BLOCK */}
          <View className="gap-2">
            <ThemedText type="defaultSemiBold">Or paste the invite link</ThemedText>
            <AppTextInput
              value={inviteLink}
              placeholder="https://events.lueur.app/invite/ABC123"
              onChangeText={(text) => {
                setInviteLink(text);
                setError(null);
              }}
            />

            {error ? <ThemedText className="text-red-500">{error}</ThemedText> : null}

            {/* JOIN BUTTON */}
            <PrimaryButton text="Join with Link" onPress={handleLinkJoin} />
          </View>

          {/* CANCEL */}
          <CancelButton onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
