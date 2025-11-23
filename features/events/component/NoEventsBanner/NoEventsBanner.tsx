import { Text, View } from "react-native";

const NoEventsBanner = () => (
  <View className="flex-row items-center gap-3 rounded-2xl p-4 bg-ui-surface dark:bg-dark-surface border border-ui-border dark:border-dark-border">
    <Text className="text-sm text-text-muted dark:text-dark-textMuted">Events you join will appear here.</Text>
  </View>
);

export default NoEventsBanner;
