import { Pressable, Text, useColorScheme } from "react-native";
import { Event } from "../../types";
import { formatEventDate } from "../../utils";

type EventCardProps = {
  event: Event;
  onPress: () => void;
};

const EventCard = ({ event, onPress }: EventCardProps) => (
  <Pressable
    key={`joined-${event.id}`}
    onPress={onPress}
    className="border border-gray-300 dark:border-gray-600 rounded-3xl p-5 gap-1 bg-white dark:bg-gray-900"
  >
    <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">{event.title}</Text>
    <Text className="text-sm text-gray-600 dark:text-gray-400">
      {formatEventDate(event.date)} • {event.location}
    </Text>
    <Text className="text-sm text-gray-600 dark:text-gray-400">{event.attendees} attendees</Text>
  </Pressable>
);

export default EventCard;
