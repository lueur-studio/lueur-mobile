import api from "./api";
import { User } from "./auth";

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class UserService {
  async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      const response = await api.put("/api/users/me", data);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      await api.put("/api/users/change-password", data);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteProfile(): Promise<void> {
    try {
      await api.delete("/api/users/me");
    } catch (error: any) {
      throw this.handleError(error);
    }
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

export const userService = new UserService();
