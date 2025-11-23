import PrimaryButton from "@/components/ui/AppButton/PrimaryButton/PrimaryButton";
import AppTextInput from "@/components/ui/AppTextInput/AppTextInput";
import { H1 } from "@/components/ui/ThemedText/Heading/Heading";
import { ThemedText } from "@/components/ui/ThemedText/ThemedText";
import { Colors } from "@/constants/theme";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CreatedEventSummary = {
  title: string;
  description: string;
  date: string;
  shareLink: string;
  qrReference: string;
};

const CreateEventForm = () => {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<CreatedEventSummary | null>(null);

  function slugify(input: string) {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  const handleCreateEvent = () => {
    if (!title.trim() || !description.trim() || !date.trim()) {
      setError("Please complete all of the fields.");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const slug = slugify(title);
      const shareLink = `https://events.lueur.app/${slug || "event"}/${Date.now().toString().slice(-5)}`;
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

  return (
    <ScrollView keyboardShouldPersistTaps="handled" className="p-6">
      <View className="space-y-2 mb-6">
        <H1>Create an Event</H1>
        <ThemedText>Add details so the team can generate the invite link and QR code automatically.</ThemedText>
      </View>

      <View className="space-y-4 mb-6">
        <AppTextInput value={title} onChangeText={setTitle} />
        <AppTextInput value={description} onChangeText={setDescription} />
        <AppTextInput value={date} onChangeText={setDate} />
      </View>

      {error ? <ThemedText className="text-red-500 mb-4">{error}</ThemedText> : null}

      <PrimaryButton text="Create Event" onPress={handleCreateEvent} />
    </ScrollView>
  );
};

export default CreateEventForm;
