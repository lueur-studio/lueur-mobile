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
    <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</Text>
    {isLoading ? (
      <ActivityIndicator size="small" />
    ) : events.length === 0 ? (
      <NoEventsBanner />
    ) : (
      events.map((event) => <EventCard event={event} onPress={() => {}} />)
    )}
  </View>
);

export default EventsList;
