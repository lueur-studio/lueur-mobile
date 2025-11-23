import PrimaryButton from "@/components/ui/AppButton/PrimaryButton/PrimaryButton";
import LabeledTextInput from "@/components/ui/AppTextInput/LabeledInput/LabeledTextInput";
import { H1 } from "@/components/ui/ThemedText/Heading/Heading";
import { ThemedText } from "@/components/ui/ThemedText/ThemedText";
import { ScrollView, View } from "react-native";
import { useCreateEventForm } from "../../hooks/useCreateEventForm";

const CreateEventForm = () => {
  const { title, description, date, error, setTitle, setDescription, setDate, setError, handleCreateEvent } =
    useCreateEventForm();

  return (
    <ScrollView keyboardShouldPersistTaps="handled" className="p-6">
      <View className="space-y-2 mb-6">
        <H1>Create an Event</H1>
        <ThemedText>Add details so the team can generate the invite link and QR code automatically.</ThemedText>
      </View>

      <View className="space-y-3 mb-10">
        <LabeledTextInput
          label="Event Title"
          value={title}
          placeholder="Pop-up gallery night"
          onChangeText={setTitle}
        />
        <LabeledTextInput
          label="Description"
          value={description}
          placeholder="Tell everyone what to expect..."
          onChangeText={setDescription}
        />
        <LabeledTextInput label="Date & Time" value={date} placeholder="2025-03-05 • 7:00 PM" onChangeText={setDate} />
      </View>

      {error ? <ThemedText className="text-red-500 mb-4">{error}</ThemedText> : null}

      <PrimaryButton text="Create Event" onPress={handleCreateEvent} />
    </ScrollView>
  );
};

export default CreateEventForm;
