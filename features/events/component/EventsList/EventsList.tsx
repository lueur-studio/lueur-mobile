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
  <View className="gap-4">
    <H2 className="text-xl font-bold">{title}</H2>
    {isLoading ? (
      <View className="py-12 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    ) : events.length === 0 ? (
      <NoEventsBanner />
    ) : (
      <View className="gap-4">
        {events.map((event) => (
          <EventCard event={event} onPress={() => {}} key={event.id} />
        ))}
      </View>
    )}
  </View>
);

export default EventsList;
