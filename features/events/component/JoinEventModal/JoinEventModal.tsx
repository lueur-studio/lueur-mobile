import CancelButton from "@/components/ui/AppButton/CancelButton/CancelButton";
import PrimaryButton from "@/components/ui/AppButton/PrimaryButton/PrimaryButton";
import AppTextInput from "@/components/ui/AppTextInput/AppTextInput";
import { H2 } from "@/components/ui/ThemedText/Heading/Heading";
import { ThemedText } from "@/components/ui/ThemedText/ThemedText";
import { Modal, View } from "react-native";
import { useJoinEventModal } from "../../hooks/useJoinEventModal";
import QRButton from "../QRButton/QRButton";

type JoinEventModalProps = {
  visible: boolean;
  onClose: () => void;
  onJoinLink: (link: string) => void;
};

const JoinEventModal = ({ visible, onClose, onJoinLink }: JoinEventModalProps) => {
  const { inviteLink, error, handleInviteLinkChange, handleInviteLinkSubmit } = useJoinEventModal(visible, onJoinLink);

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View className="flex-1 justify-end bg-black/45">
        <View className="p-6 gap-5 rounded-2xl p-4 bg-ui-background dark:bg-dark-background">
          <View className="gap-1">
            <H2>Join an Event</H2>
            <ThemedText>Choose how you'd like to join the event shared with you.</ThemedText>
          </View>

          <QRButton />

          <View className="gap-2">
            <ThemedText>Or paste the invite link</ThemedText>
            <AppTextInput
              value={inviteLink}
              placeholder="https://events.lueur.app/invite/example123"
              onChangeText={handleInviteLinkChange}
            />
            {error ? <ThemedText className="text-red-500">{error}</ThemedText> : null}
            <PrimaryButton text="Join with Link" onPress={handleInviteLinkSubmit} />
          </View>

          <CancelButton onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default JoinEventModal;
