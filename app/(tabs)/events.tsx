import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import EventCard from "@/features/events/component/EventCard/EventCard";
import { Event } from "@/features/events/types";

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
          <Pressable
            accessibilityRole="button"
            onPress={() => setJoinModalVisible(true)}
            style={({ pressed }) => [
              styles.joinButton,
              {
                backgroundColor: palette.tint,
              },
              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#fff" />
            <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff" style={styles.actionLabel}>
              Join Event
            </ThemedText>
            <ThemedText lightColor="#f8fafc" darkColor="#f8fafc">
              Scan a QR code or enter a link
            </ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/events/create")}
            style={({ pressed }) => [
              styles.createButton,
              {
                borderColor: colorScheme === "dark" ? "rgba(255,255,255,0.2)" : "#CBD5F5",
              },
              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons name="calendar-plus" size={24} color={palette.text} />
            <ThemedText type="subtitle" style={styles.actionLabel}>
              Create Event
            </ThemedText>
            <ThemedText className="text-gray-500 dark:text-gray-300">
              Draft a title, description, and schedule.
            </ThemedText>
          </Pressable>
        </View>

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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  palette={palette}
                  onPress={() => Alert.alert("Event", event.title)}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View className="gap-3">
          <ThemedText type="subtitle">Your joined events</ThemedText>
          {isLoading ? (
            <View
              style={[
                styles.joinedCard,
                {
                  backgroundColor: colorScheme === "dark" ? "#1F2125" : "#f5f5f7",
                },
              ]}
            >
              <ActivityIndicator size="small" color={palette.tint} />
            </View>
          ) : joinedEvents.length === 0 ? (
            <View
              style={[
                styles.joinedCard,
                {
                  backgroundColor: colorScheme === "dark" ? "#1F2125" : "#f5f5f7",
                },
              ]}
            >
              <ThemedText className="text-gray-500 dark:text-gray-300">Events you join will appear here.</ThemedText>
            </View>
          ) : (
            joinedEvents.map((event) => (
              <View
                key={`joined-${event.id}`}
                style={[
                  styles.joinedCard,
                  {
                    backgroundColor: colorScheme === "dark" ? "#1F2125" : "#f5f5f7",
                  },
                ]}
              >
                <View className="flex-1 gap-1">
                  <ThemedText type="defaultSemiBold">{event.title}</ThemedText>
                  <ThemedText className="text-gray-500 dark:text-gray-300">
                    {formatEventDate(event.date)} • {event.location}
                  </ThemedText>
                  <ThemedText className="text-gray-500 dark:text-gray-300">{event.attendees} attendees</ThemedText>
                </View>
                <Pressable
                  style={styles.secondaryButton}
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
}

type JoinEventModalProps = {
  visible: boolean;
  onClose: () => void;
  onJoinLink: (link: string) => void;
  palette: (typeof Colors)["light"];
  colorScheme: "light" | "dark";
};

function JoinEventModal({ visible, onClose, onJoinLink, palette, colorScheme }: JoinEventModalProps) {
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setInviteLink("");
      setError(null);
    }
  }, [visible]);

  const placeholderColor = colorScheme === "dark" ? "#94A3B8" : "#94A3B8";

  const handleLinkJoin = () => {
    if (!inviteLink.trim()) {
      setError("Please paste the invitation URL.");
      return;
    }
    onJoinLink(inviteLink.trim());
  };

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View style={styles.modalBackdrop}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colorScheme === "dark" ? "#181a1f" : "#fff",
            },
          ]}
        >
          <View className="gap-1">
            <ThemedText type="subtitle">Join an event</ThemedText>
            <ThemedText className="text-gray-500 dark:text-gray-300">
              Choose how you&apos;d like to join the event shared with you.
            </ThemedText>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.qrButton,
              {
                borderColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)",
              },
              pressed && styles.pressed,
            ]}
            onPress={() => Alert.alert("Camera coming soon", "The QR scanner is being wired up with the camera team.")}
          >
            <MaterialCommunityIcons name="camera" size={22} color={palette.tint} />
            <View className="flex-1">
              <ThemedText type="defaultSemiBold">Scan QR code</ThemedText>
              <ThemedText className="text-gray-500 dark:text-gray-300">
                Opens your camera to scan an event invite.
              </ThemedText>
            </View>
          </Pressable>

          <View className="gap-2">
            <ThemedText type="defaultSemiBold">Or paste the invite link</ThemedText>
            <TextInput
              value={inviteLink}
              onChangeText={(text) => {
                setInviteLink(text);
                setError(null);
              }}
              placeholder="https://events.lueur.app/invite/ABC123"
              placeholderTextColor={placeholderColor}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.input,
                {
                  borderColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)",
                  color: palette.text,
                },
              ]}
            />
            {error ? <ThemedText className="text-red-500">{error}</ThemedText> : null}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: palette.tint },
                pressed && styles.pressed,
              ]}
              onPress={handleLinkJoin}
            >
              <ThemedText type="defaultSemiBold" lightColor="#fff" darkColor="#fff">
                Join with link
              </ThemedText>
            </Pressable>
          </View>

          <Pressable style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]} onPress={onClose}>
            <ThemedText type="link">Cancel</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
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
