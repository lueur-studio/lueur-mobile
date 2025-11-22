import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService, User, SignupData, SigninData } from "@/lib/auth";
import { router } from "expo-router";
import { ActivityIndicator, View, StyleSheet } from "react-native";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (data: SignupData) => Promise<void>;
  signin: (data: SigninData) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const isAuth = await authService.isAuthenticated();

      if (isAuth) {
        // Try to refresh token to get user data
        const accessToken = await authService.refreshToken();
        if (accessToken) {
          // You might want to fetch user profile here
          // For now, we'll set a basic user object
          setUser({
            id: "",
            name: "",
            email: "",
          });
        }
      }
    } catch (error: any) {
      console.error("Auth check error:", error);
      // If there's an error accessing SecureStore, just treat as not authenticated
      setUser(null);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await authService.signup(data);
      setUser(result.user);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signin = async (data: SigninData) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await authService.signin(data);
      setUser(result.user);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      router.replace("/login");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signup,
    signin,
    logout,
    error,
    clearError,
  };

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
});
