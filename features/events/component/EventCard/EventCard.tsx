import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { Pressable, View } from "react-native";
import { formatEventDate } from "../../utils";
import { Event } from "../../types";

type EventCardProps = {
  event: Event;
  palette: (typeof Colors)["light"];
  onPress: () => void;
};

function EventCard({ event, palette, onPress }: EventCardProps) {
  return (
    <Pressable onPress={onPress} className={`w-64 rounded-3xl p-5 border gap-2`} style={{ borderColor: palette.tint }}>
      <View className="self-start bg-[rgba(15,23,42,0.8)] px-3 py-1.5 rounded-full">
        <ThemedText lightColor="#fff" darkColor="#fff" className="text-xs uppercase tracking-wider">
          {event.attendees} joined
        </ThemedText>
      </View>

      <ThemedText type="defaultSemiBold" className="text-xl">
        {event.title}
      </ThemedText>

      <ThemedText className="text-gray-600 dark:text-gray-300">{event.description}</ThemedText>

      <View className="flex-row justify-between">
        <ThemedText className="text-gray-500 dark:text-gray-300">{formatEventDate(event.date)}</ThemedText>
        <ThemedText className="text-gray-500 dark:text-gray-300">{event.location}</ThemedText>
      </View>
    </Pressable>
  );
}

export default EventCard;
