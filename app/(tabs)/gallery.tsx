import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function GalleryScreen() {
  return (
    <ThemedView className="flex-1 justify-center items-center">
      <ThemedText type="title">Gallery</ThemedText>
    </ThemedView>
  );
}
