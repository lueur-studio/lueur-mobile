import { H3 } from "@/components/ui/ThemedText/Heading/Heading";
import { ThemedText } from "@/components/ui/ThemedText/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { Event } from "../../types";
import { formatEventDate } from "../../utils";

type EventCardProps = {
  event: Event;
  onPress: () => void;
};

const EventCard = ({ event, onPress }: EventCardProps) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const { date: formattedDate, time } = formatDateTime(event.date);

  return (
    <Pressable
      key={`joined-${event.id}`}
      onPress={onPress}
      className="border border-ui-border dark:border-dark-border rounded-3xl p-5 bg-white dark:bg-gray-800 shadow-sm active:opacity-80"
    >
      <View className="gap-3">
        {/* Title */}
        <H3 className="text-lg font-bold">{event.title}</H3>

        {/* Date & Time */}
        <View className="flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
            {formattedDate} • {time}
          </ThemedText>
        </View>

        {/* Attendees */}
        {event.attendees !== undefined && (
          <View className="flex-row items-center gap-2">
            <Ionicons name="people-outline" size={16} color="#6B7280" />
            <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
              {event.attendees} {event.attendees === 1 ? "attendee" : "attendees"}
            </ThemedText>
          </View>
        )}

        {/* Description Preview */}
        {event.description && (
          <ThemedText className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2" numberOfLines={2}>
            {event.description}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
};

export default EventCard;
