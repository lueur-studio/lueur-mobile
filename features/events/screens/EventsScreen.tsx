import { ThemedText } from "@/components/themed-text";
import EventActionCard from "@/features/events/component/EventActionCard/EventActionCard";
import EventsList from "@/features/events/component/EventsList/EventsList";
import JoinEventModal from "@/features/events/component/JoinEventModal/JoinEventModal";
import { Event } from "@/features/events/types";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_EVENTS: Event[] = [
  {
    id: "art-walk",
    title: "Downtown Art Walk",
    description: "Guided stroll through the new mural collection.",
    date: "2025-02-12T18:30:00Z",
    attendees: 42,
    isJoined: true,
    location: "Austin, TX",
  },
  {
    id: "coffee-lab",
    title: "Coffee Lab & Tasting",
    description: "Learn manual brewing while sampling single-origin beans.",
    date: "2025-02-17T16:00:00Z",
    attendees: 58,
    isJoined: false,
    location: "Seattle, WA",
  },
  {
    id: "photowalk",
    title: "Sundown Photowalk",
    description: "Meet other creators for a golden-hour shoot downtown.",
    date: "2025-02-22T00:30:00Z",
    attendees: 31,
    isJoined: false,
    location: "Los Angeles, CA",
  },
  {
    id: "makers-hub",
    title: "Makers Hub Open Studio",
    description: "Bring your project and pair up with new collaborators.",
    date: "2025-02-28T21:00:00Z",
    attendees: 76,
    isJoined: true,
    location: "Chicago, IL",
  },
];

const EventsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    // Mock GET request latency so the UI reflects the future integration.
    await new Promise((resolve) => setTimeout(resolve, 650));
    setEvents(MOCK_EVENTS);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const joinedEvents = useMemo(() => events.filter((event) => event.isJoined), [events]);

  const handleJoinViaLink = useCallback(
    (link: string) => {
      const timestamp = Date.now();
      const generatedEvent: Event = {
        id: `shared-${timestamp}`,
        title: "Shared Event",
        description: "Imported via shared link — details sync coming soon.",
        date: new Date().toISOString(),
        attendees: 1,
        isJoined: true,
        location: link.replace(/^https?:\/\//, "").split("/")[0] ?? "Online",
      };

      setEvents((prev) => [generatedEvent, ...prev]);
      setJoinModalVisible(false);
      Alert.alert("Joined event", "You have joined the shared event.");
    },
    [setEvents],
  );

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom + 16, 32),
        }}
      >
        <View className="px-6 gap-6">
          <View className="gap-2">
            <ThemedText type="title">Events</ThemedText>
            <ThemedText className="text-base text-gray-500 dark:text-gray-300">
              Browse community events, join via QR, or create your own meetups.
            </ThemedText>
          </View>

          <View className="flex-row gap-4">
            <EventActionCard
              title="Join Event"
              description="Scan a QR code or enter a link"
              onPress={() => setJoinModalVisible(true)}
            />
            <EventActionCard
              title="Create Event"
              description="Draft a title, description, and schedule"
              onPress={() => router.push("/events/create")}
            />
          </View>
          <EventsList title="Upcoming Events" isLoading={isLoading} events={joinedEvents} />
        </View>
      </ScrollView>

      <JoinEventModal
        visible={joinModalVisible}
        onClose={() => setJoinModalVisible(false)}
        onJoinLink={handleJoinViaLink}
      />
    </View>
  );
};

export default EventsScreen;
