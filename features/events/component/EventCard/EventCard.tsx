import { Pressable, Text } from "react-native";
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
    className="border border-ui-border dark:border-dark-border rounded-3xl p-5 gap-1 bg-ui-surface dark:bg-dark-surface"
  >
    <Text className="text-lg font-semibold text-text-main dark:text-dark-text">{event.title}</Text>
    <Text className="text-sm text-text-muted dark:text-dark-text-muted">
      {formatEventDate(event.date)} • {event.location}
    </Text>
    <Text className="text-sm text-text-muted dark:text-dark-text-muted">{event.attendees} attendees</Text>
  </Pressable>
);

export default EventCard;
