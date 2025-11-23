import { Text } from "react-native";

type HeadingProps = {
  children: string;
};

export const H1 = ({ children }: HeadingProps) => (
  <Text className="text-2xl font-bold text-text-main dark:text-dark-text">{children}</Text>
);

export const H2 = ({ children }: HeadingProps) => (
  <Text className="text-xl font-semibold text-text-main dark:text-dark-text">{children}</Text>
);

export const H3 = ({ children }: HeadingProps) => (
  <Text className="text-lg font-semibold text-text-main dark:text-dark-text">{children}</Text>
);
