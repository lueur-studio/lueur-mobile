import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@react-navigation/elements";
import { router } from "expo-router";

export default function LoginScreen() {
  return (
    <ThemedView className="flex-1 justify-center items-center">
      <ThemedText type="title">Login</ThemedText>
      <Button onPress={() => router.replace("/(tabs)/home")}>Sign In</Button>
    </ThemedView>
  );
}
