import React from "react";
import { SafeAreaView } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import GalleryScreen from "./gallery";
import EventsScreen from "./events";
import ProfileScreen from "./profile";

const TopTabs = createMaterialTopTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? "light"].tint;

  const screenConfig = [
    { name: "gallery", title: "Gallery", icon: "photo.fill", component: GalleryScreen },
    { name: "events", title: "Events", icon: "calendar", component: EventsScreen },
    { name: "profile", title: "Profile", icon: "person.fill", component: ProfileScreen },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors[colorScheme ?? "light"].background }}>
      <TopTabs.Navigator
        tabBarPosition="bottom"
        screenOptions={{
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
          tabBarIndicatorStyle: {
            backgroundColor: "transparent",
          },
          lazy: true,
        }}
      >
        {screenConfig.map(({ name, title, icon, component }) => (
          <TopTabs.Screen
            key={name}
            name={name}
            component={component}
            options={{
              title: title,
              tabBarIcon: ({ color }) => <IconSymbol size={28} name={icon as any} color={color} />,
            }}
          />
        ))}
      </TopTabs.Navigator>
    </SafeAreaView>
  );
}
