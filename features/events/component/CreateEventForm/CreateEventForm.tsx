import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createEvent } from "@/lib/event";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const CreateEventForm = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCreateEvent = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Please complete all of the required fields.");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const event = await createEvent({
        title: title.trim(),
        description: description.trim(),
        date: date.toISOString(),
      });

      Alert.alert("Success", "Event created successfully!", [
        {
          text: "OK",
          onPress: () => {
            setTitle("");
            setDescription("");
            setDate(new Date());
            router.back();
          },
        },
      ]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create event";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>Create an Event</Text>
          <Text style={[styles.subtitle, isDark ? styles.subtitleDark : styles.subtitleLight]}>
            Fill in the details below to create your event and get a shareable invitation link.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Event Title"
            placeholder="Enter event name"
            value={title}
            onChangeText={setTitle}
          />

          <Input
            label="Description"
            placeholder="What's this event about?"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: "top" }}
          />

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>Date & Time</Text>
            <View style={styles.dateTimeContainer}>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={[styles.dateTimeButton, isDark ? styles.dateTimeButtonDark : styles.dateTimeButtonLight]}
              >
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                <Text style={[styles.dateTimeText, isDark ? styles.textDark : styles.textLight]}>
                  {formatDate(date)}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setShowTimePicker(true)}
                style={[styles.dateTimeButton, isDark ? styles.dateTimeButtonDark : styles.dateTimeButtonLight]}
              >
                <Ionicons name="time-outline" size={20} color="#6B7280" />
                <Text style={[styles.dateTimeText, isDark ? styles.textDark : styles.textLight]}>
                  {formatTime(date)}
                </Text>
              </Pressable>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleTimeChange}
            />
          )}

          {Platform.OS === "ios" && (showDatePicker || showTimePicker) && (
            <Button
              title="Done"
              onPress={() => {
                setShowDatePicker(false);
                setShowTimePicker(false);
              }}
            />
          )}
        </View>

        {error && (
          <View style={[styles.errorContainer, isDark ? styles.errorContainerDark : styles.errorContainerLight]}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Button title="Create Event" onPress={handleCreateEvent} isLoading={isSubmitting} />
      </View>
    </ScrollView>
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
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  subtitleLight: {
    color: "#6B7280",
  },
  subtitleDark: {
    color: "#9CA3AF",
  },
  textLight: {
    color: "#111827",
  },
  textDark: {
    color: "#F9FAFB",
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  labelLight: {
    color: "#374151",
  },
  labelDark: {
    color: "#E5E7EB",
  },
  dateTimeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateTimeButtonLight: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
  },
  dateTimeButtonDark: {
    backgroundColor: "#1F2937",
    borderColor: "#374151",
  },
  dateTimeText: {
    fontSize: 16,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
  },
  errorContainerLight: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  errorContainerDark: {
    backgroundColor: "#7F1D1D",
    borderColor: "#991B1B",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
  },
});

export default CreateEventForm;
