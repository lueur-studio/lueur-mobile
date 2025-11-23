import { ReactNode } from "react";
import { Text } from "react-native";

type ThemedTextProps = {
  children: ReactNode;
  className?: string;
};

export const ThemedText = ({ children, className = "" }: ThemedTextProps) => (
  <Text className={`text-text-main dark:text-dark-text ${className}`}>{children}</Text>
);
