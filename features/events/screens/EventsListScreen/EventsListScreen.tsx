import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TEvent } from "../../types";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { JoinEventModal } from "../../components/JoinEventModal/JoinEventModal";
import { formatEventDate } from "../../utils";
import EventCard from "../../components/EventCard/EventCard";

const MOCK_EVENTS: TEvent[] = [
  {
    id: "art-walk",
    title: "Downtown Art Walk",
    description: "Guided stroll through the new mural collection.",
    date: "2025-02-12T18:30:00Z",
    numAttendees: 42,
    isJoined: true,
    location: "Austin, TX",
  },
  {
    id: "coffee-lab",
    title: "Coffee Lab & Tasting",
    description: "Learn manual brewing while sampling single-origin beans.",
    date: "2025-02-17T16:00:00Z",
    numAttendees: 58,
    isJoined: false,
    location: "Seattle, WA",
  },
  {
    id: "photowalk",
    title: "Sundown Photowalk",
    description: "Meet other creators for a golden-hour shoot downtown.",
    date: "2025-02-22T00:30:00Z",
    numAttendees: 31,
    isJoined: false,
    location: "Los Angeles, CA",
  },
  {
    id: "makers-hub",
    title: "Makers Hub Open Studio",
    description: "Bring your project and pair up with new collaborators.",
    date: "2025-02-28T21:00:00Z",
    numAttendees: 76,
    isJoined: true,
    location: "Chicago, IL",
  },
];

const EventsListScreen = () => {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [events, setEvents] = useState<TEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    setEvents(MOCK_EVENTS);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const joinedEvents = useMemo(() => events.filter((e) => e.isJoined), [events]);

  const handleJoinViaLink = useCallback(
    (link: string) => {
      const timestamp = Date.now();
      const generatedEvent: TEvent = {
        id: `shared-${timestamp}`,
        title: "Shared Event",
        description: "Imported via shared link — details sync coming soon.",
        date: new Date().toISOString(),
        numAttendees: 1,
        isJoined: true,
        location: link.replace(/^https?:\/\//, "").split("/")[0] ?? "Online",
      };

      setEvents((prev) => [generatedEvent, ...prev]);
      setJoinModalVisible(false);
      Alert.alert("Joined event", "You have joined the shared event.");
    },
    [setEvents],
  );

  const handleRefresh = () => {
    if (!isLoading) fetchEvents();
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom + 16, 32),
        }}
        className="px-4 gap-8"
      >
        {/* Header */}
        <View className="gap-2">
          <ThemedText type="title">Events</ThemedText>
          <ThemedText className="text-base text-gray-500 dark:text-gray-300">
            Browse community events, join via QR, or create your own meetups.
          </ThemedText>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-4">
          {/* Join Event Button */}
          <Pressable
            accessibilityRole="button"
            onPress={() => setJoinModalVisible(true)}
            className="flex-1 rounded-2xl p-4 active:opacity-80"
            style={{ backgroundColor: palette.tint }}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#fff" />
            <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff" className="mt-2">
              Join Event
            </ThemedText>
            <ThemedText lightColor="#f8fafc" darkColor="#f8fafc">
              Scan a QR code or enter a link
            </ThemedText>
          </Pressable>

          {/* Create Event Button */}
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/events/create")}
            className="flex-1 rounded-2xl p-4 active:opacity-80 border"
            style={{ borderColor: colorScheme === "dark" ? "rgba(255,255,255,0.2)" : "#CBD5F5" }}
          >
            <MaterialCommunityIcons name="calendar-plus" size={24} color={palette.text} />
            <ThemedText type="subtitle" className="mt-2">
              Create Event
            </ThemedText>
            <ThemedText className="text-gray-500 dark:text-gray-300">
              Draft a title, description, and schedule.
            </ThemedText>
          </Pressable>
        </View>

        {/* All Events */}
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <ThemedText type="subtitle">All events</ThemedText>
            <Pressable onPress={handleRefresh}>
              <ThemedText type="link">Refresh</ThemedText>
            </Pressable>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={palette.tint} />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingRight: 16 }}
            >
              {events.map((event) => (
                <EventCard key={event.id} event={event} palette={palette} onPress={() => {}} />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Joined Events */}
        <View className="gap-3">
          <ThemedText type="subtitle">Your joined events</ThemedText>

          {isLoading ? (
            <View
              className="rounded-xl p-4 items-center justify-center"
              style={{ backgroundColor: colorScheme === "dark" ? "#1F2125" : "#f5f5f7" }}
            >
              <ActivityIndicator size="small" color={palette.tint} />
            </View>
          ) : joinedEvents.length === 0 ? (
            <View
              className="rounded-xl p-4"
              style={{ backgroundColor: colorScheme === "dark" ? "#1F2125" : "#f5f5f7" }}
            >
              <ThemedText className="text-gray-500 dark:text-gray-300">Events you join will appear here.</ThemedText>
            </View>
          ) : (
            joinedEvents.map((event) => (
              <View
                key={`joined-${event.id}`}
                className="rounded-xl p-4 flex-row items-center"
                style={{ backgroundColor: colorScheme === "dark" ? "#1F2125" : "#f5f5f7" }}
              >
                <View className="flex-1 gap-1">
                  <ThemedText type="defaultSemiBold">{event.title}</ThemedText>
                  <ThemedText className="text-gray-500 dark:text-gray-300">
                    {formatEventDate(event.date)} • {event.location}
                  </ThemedText>
                  <ThemedText className="text-gray-500 dark:text-gray-300">{event.numAttendees} attendees</ThemedText>
                </View>

                <Pressable
                  className="px-3 py-2 rounded-lg active:opacity-80"
                  onPress={() =>
                    Alert.alert(
                      "Event details coming soon",
                      "The event detail experience is part of the next milestone.",
                    )
                  }
                >
                  <ThemedText type="link">View</ThemedText>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <JoinEventModal
        visible={joinModalVisible}
        onClose={() => setJoinModalVisible(false)}
        onJoinLink={handleJoinViaLink}
        palette={palette}
        colorScheme={colorScheme}
      />
    </ThemedView>
  );
};

export default EventsListScreen;
