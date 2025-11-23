import { ActivityIndicator, Text, View } from "react-native";
import NoEventsBanner from "../NoEventsBanner/NoEventsBanner";
import { Event } from "../../types";
import EventCard from "../EventCard/EventCard";

type EventsListProps = {
  title: string;
  isLoading: boolean;
  events: Event[];
};

// TODO: Implement onPress for EventCard
const EventsList = ({ title, isLoading, events }: EventsListProps) => (
  <View className="gap-3">
    <Text className="text-xl font-bold text-text-main dark:text-dark-text">{title}</Text>
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
