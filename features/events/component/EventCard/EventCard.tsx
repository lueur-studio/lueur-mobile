import { H3 } from "@/components/ui/ThemedText/Heading/Heading";
import { ThemedText } from "@/components/ui/ThemedText/ThemedText";
import { Pressable } from "react-native";
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
    <H3>{event.title}</H3>
    <ThemedText>
      {formatEventDate(event.date)} • {event.location}
    </ThemedText>
    <ThemedText>{event.attendees} attendees</ThemedText>
  </Pressable>
);

export default EventCard;
