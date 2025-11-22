import * as SecureStore from "expo-secure-store";
import api from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

class AuthService {
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await api.post("/api/auth/signup", data);
      const { user, accessToken, refreshToken } = response.data.data;

      await this.storeTokens(accessToken, refreshToken);

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async signin(data: SigninData): Promise<AuthResponse> {
    try {
      const response = await api.post("/api/auth/signin", data);
      const { user, accessToken, refreshToken } = response.data.data;

      await this.storeTokens(accessToken, refreshToken);

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await this.clearTokens();
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (!refreshToken) {
        return null;
      }

      const response = await api.post("/api/auth/refresh", { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      await this.storeTokens(accessToken, newRefreshToken || refreshToken);

      return accessToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      await this.clearTokens();
      return null;
    }
  }

  async getUserProfile(): Promise<User | null> {
    try {
      const response = await api.get("/api/users/me");
      return response.data.data;
    } catch (error) {
      console.error("Get user profile error:", error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    return !!refreshToken;
  }

  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync("accessToken");
  }

  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync("refreshToken");
  }

  private async storeTokens(accessToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
  }

  private async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || "An error occurred";
      return new Error(message);
    } else if (error.request) {
      return new Error("Network error. Please check your connection.");
    } else {
      return new Error(error.message || "An unexpected error occurred");
    }
  }
}

export const authService = new AuthService();
