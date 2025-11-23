import { H3 } from "@/components/ui/ThemedText/Heading/Heading";
import { ThemedText } from "@/components/ui/ThemedText/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

type EventActionCardProps = {
  title: string;
  description: string;
  onPress: () => void;
};

const EventActionCard = ({ title, description, onPress }: EventActionCardProps) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    className="flex-1 rounded-2xl p-4 gap-2 border border-ui-border dark:border-dark-border active:opacity-80"
  >
    <View className="mb-1 text-text-main dark:text-dark-text">
      <MaterialCommunityIcons name="calendar-plus" size={24} color="currentColor" />
    </View>

    <H3>{title}</H3>
    <ThemedText>{description}</ThemedText>
  </Pressable>
);

export default EventActionCard;
