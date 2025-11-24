import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Event } from "@/features/events/types";
import { getEventById, updateEvent } from "@/lib/event";
import EditEventModal from "@/features/events/component/EditEventModal/EditEventModal";
import { useAuth } from "@/context/auth-context";

const EventDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Mock images for now
  const [images, setImages] = useState<string[]>([
    "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Event+Photo+1",
    "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Event+Photo+2",
    "https://via.placeholder.com/300x200/EC4899/FFFFFF?text=Event+Photo+3",
    "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Event+Photo+4",
  ]);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setIsLoading(true);
      const eventData = await getEventById(Number(id));
      setEvent(eventData);
    } catch (error: any) {
      console.error("Failed to fetch event details:", error);
      Alert.alert("Error", "Failed to load event details");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const handleUploadImage = () => {
    Alert.alert("Upload Image", "Image upload functionality will be implemented later");
    // TODO: Implement image picker and upload
  };

  const handleUpdateEvent = async (data: { title: string; description: string; date: string }) => {
    try {
      const updatedEvent = await updateEvent(Number(id), data);
      setEvent(updatedEvent);
      Alert.alert("Success", "Event updated successfully");
      setEditModalVisible(false);
    } catch (error: any) {
      console.error("Failed to update event:", error);
      throw new Error(error.response?.data?.message || "Failed to update event");
    }
  };

  const isAdmin = event?.userAccessLevel === 0;

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
          <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={isDark ? "#F9FAFB" : "#111827"} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>Event Details</Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        </View>
      </>
    );
  }

  if (!event) {
    return null;
  }

  const { date, time } = formatDateTime(event.date);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
        {/* Header with Back Button */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={isDark ? "#F9FAFB" : "#111827"} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>Event Details</Text>
          {isAdmin && (
            <TouchableOpacity onPress={() => setEditModalVisible(true)} style={styles.editButton}>
              <Ionicons name="pencil" size={20} color="#3B82F6" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Event Info Section */}
          <View style={[styles.infoCard, isDark ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>{event.title}</Text>

            {/* Date & Time */}
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#6366F1" />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, isDark ? styles.textMuted : styles.textMutedLight]}>Date & Time</Text>
                <Text style={[styles.infoText, isDark ? styles.textDark : styles.textLight]}>{date}</Text>
                <Text style={[styles.infoText, isDark ? styles.textDark : styles.textLight]}>{time}</Text>
              </View>
            </View>

            {/* Description */}
            {event.description && (
              <View style={styles.descriptionContainer}>
                <Text style={[styles.infoLabel, isDark ? styles.textMuted : styles.textMutedLight]}>Description</Text>
                <Text style={[styles.description, isDark ? styles.textDark : styles.textLight]}>
                  {event.description}
                </Text>
              </View>
            )}
          </View>

          {/* Photos Section */}
          <View style={styles.photosSection}>
            <View style={styles.photosSectionHeader}>
              <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>Event Photos</Text>
              <TouchableOpacity onPress={handleUploadImage} style={styles.uploadButton}>
                <Ionicons name="add-circle" size={24} color="#3B82F6" />
                <Text style={styles.uploadButtonText}>Add Photo</Text>
              </TouchableOpacity>
            </View>

            {images.length === 0 ? (
              <View style={[styles.emptyPhotos, isDark ? styles.cardDark : styles.cardLight]}>
                <Ionicons name="images-outline" size={48} color={isDark ? "#6B7280" : "#9CA3AF"} />
                <Text style={[styles.emptyPhotosText, isDark ? styles.textMuted : styles.textMutedLight]}>
                  No photos yet
                </Text>
                <Text style={[styles.emptyPhotosSubtext, isDark ? styles.textMuted : styles.textMutedLight]}>
                  Add photos to share memories from this event
                </Text>
              </View>
            ) : (
              <View style={styles.photosGrid}>
                {images.map((imageUrl, index) => (
                  <Pressable key={index} style={styles.photoItem}>
                    <Image source={{ uri: imageUrl }} style={styles.photoImage} />
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Edit Modal */}
        {event && isAdmin && (
          <EditEventModal
            visible={editModalVisible}
            event={event}
            onClose={() => setEditModalVisible(false)}
            onSave={handleUpdateEvent}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: "#F9FAFB",
  },
  containerDark: {
    backgroundColor: "#111827",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    marginLeft: "auto",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 20,
  },
  cardLight: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardDark: {
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  infoTextContainer: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 16,
  },
  descriptionContainer: {
    gap: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  photosSection: {
    gap: 16,
  },
  photosSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
  },
  uploadButtonText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyPhotos: {
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    gap: 8,
  },
  emptyPhotosText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  emptyPhotosSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  photoItem: {
    width: "48%",
    aspectRatio: 1.5,
    borderRadius: 12,
    overflow: "hidden",
  },
  photoImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  textLight: {
    color: "#111827",
  },
  textDark: {
    color: "#F9FAFB",
  },
  textMutedLight: {
    color: "#6B7280",
  },
  textMuted: {
    color: "#9CA3AF",
  },
});

export default EventDetailScreen;
