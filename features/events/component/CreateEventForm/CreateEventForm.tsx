import PrimaryButton from "@/components/ui/AppButton/PrimaryButton/PrimaryButton";
import LabeledTextInput from "@/components/ui/AppTextInput/LabeledInput/LabeledTextInput";
import { H1 } from "@/components/ui/ThemedText/Heading/Heading";
import { ThemedText } from "@/components/ui/ThemedText/ThemedText";
import { useState } from "react";
import { ScrollView, View } from "react-native";

type CreatedEventSummary = {
  title: string;
  description: string;
  date: string;
  shareLink: string;
  qrReference: string;
};

const CreateEventForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<CreatedEventSummary | null>(null);

  const slugify = (input: string) => {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

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

      <View className="space-y-3 mb-10">
        <LabeledTextInput label="Event Title" value={title} onChangeText={setTitle} />
        <LabeledTextInput label="Description" value={description} onChangeText={setDescription} />
        <LabeledTextInput label="Date & Time" value={date} onChangeText={setDate} />
      </View>

      {error ? <ThemedText className="text-red-500 mb-4">{error}</ThemedText> : null}

      <PrimaryButton text="Create Event" onPress={handleCreateEvent} loading={isSubmitting} />
    </ScrollView>
  );
};

export default CreateEventForm;
