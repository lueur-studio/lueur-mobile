import { H2 } from "@/components/ui/ThemedText/Heading/Heading";
import { ActivityIndicator, View } from "react-native";
import { Event } from "../../types";
import EventCard from "../EventCard/EventCard";
import NoEventsBanner from "../NoEventsBanner/NoEventsBanner";

type EventsListProps = {
  title: string;
  isLoading: boolean;
  events: Event[];
};

// TODO: Implement onPress for EventCard
const EventsList = ({ title, isLoading, events }: EventsListProps) => (
  <View className="gap-3">
    <H2>Upcoming Events</H2>
    {isLoading ? (
      <ActivityIndicator size="small" />
    ) : events.length === 0 ? (
      <NoEventsBanner />
    ) : (
      events.map((event) => <EventCard event={event} onPress={() => {}} key={event.id} />)
    )}
  </View>
);

export default EventsList;
