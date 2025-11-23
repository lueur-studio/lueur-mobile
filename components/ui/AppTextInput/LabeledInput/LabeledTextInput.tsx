import { View, Text } from "react-native";
import AppTextInput from "../AppTextInput";
import { ThemedText } from "../../ThemedText/ThemedText";

type LabeledTextInputProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  required?: boolean;
};

const LabeledTextInput = ({
  label,
  value,
  placeholder = "",
  onChangeText,
  required = false,
}: LabeledTextInputProps) => {
  return (
    <View className="space-y-1">
      <ThemedText className="font-semibold">
        {label}
        {required && <Text className="text-red-500"> *</Text>}
      </ThemedText>
      <AppTextInput value={value} placeholder={placeholder} onChangeText={onChangeText} />
    </View>
  );
};

export default LabeledTextInput;
