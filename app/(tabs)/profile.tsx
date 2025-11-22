import { View, Text, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || "U"}</Text>
          </View>
          <Text style={[styles.name, isDark ? styles.textDark : styles.textLight]}>{user?.name || "User"}</Text>
          <Text style={[styles.email, isDark ? styles.emailDark : styles.emailLight]}>
            {user?.email || "user@example.com"}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>Account Settings</Text>
          <Text style={[styles.placeholder, isDark ? styles.emailDark : styles.emailLight]}>
            Profile settings coming soon...
          </Text>
        </View>
        <View style={styles.actions}>
          <Button title="Logout" onPress={handleLogout} isLoading={isLoading} variant="outline" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: "#F9FAFB",
  },
  containerDark: {
    backgroundColor: "#111827",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  emailLight: {
    color: "#6B7280",
  },
  emailDark: {
    color: "#9CA3AF",
  },
  textLight: {
    color: "#111827",
  },
  textDark: {
    color: "#F9FAFB",
  },
  section: {
    marginTop: 32,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  placeholder: {
    fontSize: 14,
    fontStyle: "italic",
  },
  actions: {
    marginTop: "auto",
    paddingBottom: 24,
  },
});
