import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { Pressable, View } from "react-native";
import { TEvent } from "../../types";
import { formatEventDate } from "../../utils";

type TEventCardProps = {
  event: TEvent;
  palette: (typeof Colors)["light"];
  onPress: () => void;
};

function EventCard({ event, palette, onPress }: TEventCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl border p-4 bg-white dark:bg-[#111827] active:opacity-80"
      style={{ borderColor: palette.tint }}
    >
      {/* Badge */}
      <View className="absolute right-3 top-3 rounded-full bg-gray-800 px-3 py-1 dark:bg-gray-700">
        <ThemedText lightColor="#fff" darkColor="#fff" className="text-xs font-semibold">
          {event.numAttendees} joined
        </ThemedText>
      </View>

      {/* Title */}
      <ThemedText type="defaultSemiBold" className="text-lg mb-1">
        {event.title}
      </ThemedText>

      {/* Description */}
      <ThemedText className="text-gray-600 dark:text-gray-300 mb-3">{event.description}</ThemedText>

      {/* Footer */}
      <View className="flex-row justify-between mt-2">
        <ThemedText className="text-gray-500 dark:text-gray-300">{formatEventDate(event.date)}</ThemedText>
        <ThemedText className="text-gray-500 dark:text-gray-300">{event.location}</ThemedText>
      </View>
    </Pressable>
  );
}

export default EventCard;
