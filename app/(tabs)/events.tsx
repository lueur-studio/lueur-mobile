import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import EventActionCard from "@/features/events/component/EventActionCard/EventActionCard";
import EventsList from "@/features/events/component/EventsList/EventsList";
import JoinEventModal from "@/features/events/component/JoinEventModal/JoinEventModal";
import { Event } from "@/features/events/types";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_EVENTS: Event[] = [
  // {
  //   id: "art-walk",
  //   title: "Downtown Art Walk",
  //   description: "Guided stroll through the new mural collection.",
  //   date: "2025-02-12T18:30:00Z",
  //   attendees: 42,
  //   isJoined: true,
  //   location: "Austin, TX",
  // },
  // {
  //   id: "coffee-lab",
  //   title: "Coffee Lab & Tasting",
  //   description: "Learn manual brewing while sampling single-origin beans.",
  //   date: "2025-02-17T16:00:00Z",
  //   attendees: 58,
  //   isJoined: false,
  //   location: "Seattle, WA",
  // },
  // {
  //   id: "photowalk",
  //   title: "Sundown Photowalk",
  //   description: "Meet other creators for a golden-hour shoot downtown.",
  //   date: "2025-02-22T00:30:00Z",
  //   attendees: 31,
  //   isJoined: false,
  //   location: "Los Angeles, CA",
  // },
  // {
  //   id: "makers-hub",
  //   title: "Makers Hub Open Studio",
  //   description: "Bring your project and pair up with new collaborators.",
  //   date: "2025-02-28T21:00:00Z",
  //   attendees: 76,
  //   isJoined: true,
  //   location: "Chicago, IL",
  // },
];

export default function EventsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
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

  const handleRefresh = () => {
    if (!isLoading) {
      fetchEvents();
    }
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom + 16, 32),
          },
        ]}
      >
        <View className="gap-2">
          <ThemedText type="title">Events</ThemedText>
          <ThemedText className="text-base text-gray-500 dark:text-gray-300">
            Browse community events, join via QR, or create your own meetups.
          </ThemedText>
        </View>

        <View style={styles.actionRow}>
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
}

function formatEventDate(input: string) {
  const date = new Date(input);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    gap: 24,
  },
  actionRow: {
    flexDirection: "row",
    gap: 16,
  },
  joinButton: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    gap: 4,
  },
  createButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 4,
  },
  pressed: {
    opacity: 0.85,
  },
  actionLabel: {
    marginTop: 4,
  },
  horizontalList: {
    gap: 16,
    paddingRight: 24,
  },
  card: {
    width: 260,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    gap: 8,
  },
  cardBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(15,23,42,0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  cardBadgeText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  joinedCard: {
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  secondaryButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    padding: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 20,
  },
  qrButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  closeButton: {
    alignItems: "center",
  },
});
