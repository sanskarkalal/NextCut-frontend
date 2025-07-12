// src/services/barberService.ts
import api from "./api";

export interface BarberQueueResponse {
  barberId: number;
  queueLength: number;
  queue: Array<{
    position: number;
    queueId: number;
    user: {
      id: number;
      name: string;
      phoneNumber: string; 
    };
    enteredAt: string;
    service?: string;
  }>;
}

export interface RemoveUserResponse {
  msg: string;
  data?: any;
}

export const barberService = {
  // Get barber's current queue
  async getQueue(): Promise<BarberQueueResponse> {
    try {
      const response = await api.get<BarberQueueResponse>("/barber/queue");
      return response.data;
    } catch (error: any) {
      console.error("Error getting barber queue:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.msg ||
        "Failed to get queue";
      throw new Error(errorMessage);
    }
  },

  // Remove user from queue
  async removeUserFromQueue(userId: number): Promise<RemoveUserResponse> {
    try {
      const response = await api.post<RemoveUserResponse>(
        "/barber/remove-user",
        {
          userId,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error removing user from queue:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.msg ||
        "Failed to remove user from queue";
      throw new Error(errorMessage);
    }
  },
};
