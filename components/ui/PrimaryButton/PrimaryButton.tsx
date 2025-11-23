import { ActivityIndicator, Pressable, Text } from "react-native";

type PrimaryButtonProps = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const PrimaryButton = ({ text, onPress, disabled = false, loading = false }: PrimaryButtonProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || loading}
    className={`
        w-full rounded-2xl py-3 px-4 items-center justify-center
        bg-brand-primary dark:bg-brand-primary-dark
        active:opacity-80
        ${disabled ? "opacity-50" : ""}
      `}
  >
    {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-semibold text-base">{text}</Text>}
  </Pressable>
);

export default PrimaryButton;
