import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

type EventActionCardProps = {
  title: string;
  description: string;
  onPress: () => void;
};

const EventActionCard = ({ title, description, onPress }: EventActionCardProps) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    className="flex-1 rounded-2xl p-4 gap-1 border border-slate-300 dark:border-white/20 active:opacity-80"
  >
    <MaterialCommunityIcons name="calendar-plus" size={24} className="text-slate-900 dark:text-slate-100" />
    <Text className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</Text>
    <Text className="text-sm text-gray-500 dark:text-gray-300">{description}</Text>
  </Pressable>
);

export default EventActionCard;
