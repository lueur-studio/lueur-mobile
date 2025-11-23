import { ThemedText } from "@/components/ui/ThemedText/ThemedText";
import { View } from "react-native";

const NoEventsBanner = () => (
  <View className="flex-row items-center gap-3 rounded-2xl p-4 bg-ui-surface dark:bg-dark-surface border border-ui-border dark:border-dark-border">
    <ThemedText textColor="muted">Events you join will appear here</ThemedText>
  </View>
);

export default NoEventsBanner;
