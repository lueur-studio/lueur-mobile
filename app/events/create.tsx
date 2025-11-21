import { useState, type ComponentProps } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type CreatedEventSummary = {
  title: string;
  description: string;
  date: string;
  shareLink: string;
  qrReference: string;
};

export default function CreateEventScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<CreatedEventSummary | null>(
    null,
  );

  const handleCreateEvent = () => {
    if (!title.trim() || !description.trim() || !date.trim()) {
      setError("Please complete all of the fields.");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const slug = slugify(title);
      const shareLink = `https://events.lueur.app/${slug || "event"}/${Date.now()
        .toString()
        .slice(-5)}`;
      setCreatedEvent({
        title: title.trim(),
        description: description.trim(),
        date: date.trim(),
        shareLink,
        qrReference: `QR-${Date.now()}`,
      });
      setTitle("");
      setDescription("");
      setDate("");
      setIsSubmitting(false);
    }, 650);
  };

  const handleShareLink = async () => {
    if (!createdEvent) return;
    try {
      await Share.share({
        message: `Join "${createdEvent.title}" via ${createdEvent.shareLink}`,
      });
    } catch {
      Alert.alert("Share failed", "Unable to open the share sheet right now.");
    }
  };

  const handleDownloadQr = () => {
    if (!createdEvent) return;
    Alert.alert(
      "QR download (mock)",
      "A PDF download will be generated once the backend is ready.",
    );
  };

  return (
    <ThemedView className="flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: Math.max(insets.top + 12, 24),
              paddingBottom: Math.max(insets.bottom + 24, 32),
            },
          ]}
        >
          <View className="gap-2">
            <ThemedText type="title">Create an event</ThemedText>
            <ThemedText className="text-gray-500 dark:text-gray-300">
              Add details so the team can generate the invite link and QR code
              automatically.
            </ThemedText>
          </View>

          <View className="gap-4">
            <Field
              label="Event title"
              placeholder="Pop-up gallery night"
              value={title}
              onChangeText={setTitle}
              colorScheme={colorScheme}
              palette={palette}
            />

            <Field
              label="Description"
              placeholder="Tell everyone what to expect..."
              value={description}
              onChangeText={setDescription}
              colorScheme={colorScheme}
              palette={palette}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Field
              label="Date & time"
              placeholder="2025-03-05 • 7:00 PM"
              value={date}
              onChangeText={setDate}
              colorScheme={colorScheme}
              palette={palette}
              keyboardType="numbers-and-punctuation"
            />
          </View>

          {error ? (
            <ThemedText className="text-red-500">{error}</ThemedText>
          ) : null}

          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleCreateEvent}
            style={({ pressed }) => [
              styles.submitButton,
              {
                backgroundColor: palette.tint,
                opacity: isSubmitting ? 0.6 : pressed ? 0.85 : 1,
              },
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText
                type="defaultSemiBold"
                lightColor="#fff"
                darkColor="#fff"
              >
                Create event
              </ThemedText>
            )}
          </Pressable>

          {createdEvent ? (
            <View
              style={[
                styles.summaryCard,
                {
                  borderColor:
                    colorScheme === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(15,23,42,0.1)",
                },
              ]}
            >
              <View className="gap-1">
                <ThemedText type="subtitle">{createdEvent.title}</ThemedText>
                <ThemedText>{createdEvent.description}</ThemedText>
                <ThemedText className="text-gray-500 dark:text-gray-300">
                  {createdEvent.date}
                </ThemedText>
              </View>

              <View style={styles.qrPreview}>
                <MaterialCommunityIcons
                  name="qrcode"
                  size={72}
                  color={palette.tint}
                />
                <ThemedText className="text-gray-500 dark:text-gray-300">
                  QR preview (mock)
                </ThemedText>
              </View>

              <View className="gap-1">
                <ThemedText type="defaultSemiBold">Shareable link</ThemedText>
                <ThemedText className="text-gray-500 dark:text-gray-300">
                  {createdEvent.shareLink}
                </ThemedText>
              </View>

              <View style={styles.summaryButtonsRow}>
                <Pressable
                  onPress={handleShareLink}
                  style={({ pressed }) => [
                    styles.summaryButton,
                    {
                      backgroundColor: palette.tint,
                    },
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    lightColor="#fff"
                    darkColor="#fff"
                  >
                    Share link
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={handleDownloadQr}
                  style={({ pressed }) => [
                    styles.summaryButton,
                    {
                      borderWidth: 1,
                      borderColor:
                        colorScheme === "dark"
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(15,23,42,0.2)",
                    },
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <ThemedText type="defaultSemiBold">
                    Download QR (PDF)
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  colorScheme: "light" | "dark";
  palette: (typeof Colors)["light"];
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  colorScheme,
  palette,
  ...rest
}: FieldProps & ComponentProps<typeof TextInput>) {
  return (
    <View className="gap-2">
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={
          colorScheme === "dark" ? "#94A3B8" : "rgba(15,23,42,0.6)"
        }
        style={[
          styles.input,
          {
            backgroundColor:
              colorScheme === "dark" ? "#1D1F24" : "rgba(148, 163, 184, 0.08)",
            borderColor:
              colorScheme === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(15,23,42,0.08)",
            color: palette.text,
          },
        ]}
        {...rest}
      />
    </View>
  );
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    gap: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  submitButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    gap: 18,
  },
  qrPreview: {
    alignItems: "center",
    gap: 6,
  },
  summaryButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
});
