import { Text, View } from "react-native";

const NoEventsBanner = () => (
  <View className="rounded-2xl p-4 flex-row items-center gap-3 bg-gray-100 dark:bg-slate-900">
    <Text className="text-gray-500 dark:text-gray-300">Events you join will appear here.</Text>
  </View>
);

export default NoEventsBanner;
