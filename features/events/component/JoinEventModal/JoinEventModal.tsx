import { ThemedText } from "@/components/themed-text";
import CancelButton from "@/components/ui/AppButton/CancelButton/CancelButton";
import PrimaryButton from "@/components/ui/AppButton/PrimaryButton/PrimaryButton";
import AppTextInput from "@/components/ui/AppTextInput/AppTextInput";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
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
