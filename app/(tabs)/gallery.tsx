import { Image } from "expo-image";
import { FlatList, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type GalleryPhoto = {
  id: string;
  title: string;
  location: string;
  uri: string;
};

const mockPhotos: GalleryPhoto[] = [
  {
    id: "1",
    title: "Sunlit Studio",
    location: "SoHo, New York",
    uri: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "Backstage Calm",
    location: "Paris Fashion Week",
    uri: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    title: "Golden Hour",
    location: "Joshua Tree",
    uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    title: "Quiet Corners",
    location: "Lisbon Atelier",
    uri: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "5",
    title: "Soft Tones",
    location: "Studio 17",
    uri: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "6",
    title: "In Motion",
    location: "Downtown LA",
    uri: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
  },
];

export default function GalleryScreen() {
  return (
    <ThemedView className="flex-1">
      <FlatList
        data={mockPhotos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: 16 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 28,
          paddingBottom: 32,
        }}
        ListHeaderComponent={
          <View className="mb-6 w-full">
            <ThemedText type="title">Gallery</ThemedText>
            <ThemedText className="mt-2 text-base text-gray-500 dark:text-gray-400">
              A quick look at our latest captures and moodboards.
            </ThemedText>
          </View>
        }
        renderItem={({ item }) => (
          <View className="mb-5 flex-1">
            <View className="overflow-hidden rounded-3xl border border-zinc-100 bg-white/90 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
              <Image
                source={item.uri}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />
              <View className="px-3 py-3">
                <ThemedText className="text-base font-semibold">
                  {item.title}
                </ThemedText>
                <ThemedText className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {item.location}
                </ThemedText>
              </View>
            </View>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 192,
  },
});
