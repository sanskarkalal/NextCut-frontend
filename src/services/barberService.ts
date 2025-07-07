import api from "./api";

export interface BarberQueueResponse {
  barberId: number;
  queueLength: number;
  queue: {
    position: number;
    queueId: number;
    user: {
      id: number;
      name: string;
    };
    enteredAt: string;
  }[];
}

export interface RemoveUserResponse {
  msg: string;
  data: {
    removedUser: {
      id: number;
      name: string;
    };
    removedAt: string;
  };
}

export const barberService = {
  // Get barber's current queue
  async getQueue(): Promise<BarberQueueResponse> {
    try {
      const response = await api.get<BarberQueueResponse>("/barber/queue");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching barber queue:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch queue");
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
      throw new Error(
        error.response?.data?.error ||
          error.response?.data?.msg ||
          "Failed to remove user from queue"
      );
    }
  },
};
