import api from "./api";

export interface JoinQueueResponse {
  msg: string;
  queue: {
    id: number;
    enteredAt: string;
    barberId: number;
    userId: number;
    user: {
      id: number;
      name: string;
    };
    barber: {
      id: number;
      name: string;
    };
  };
}

export interface LeaveQueueResponse {
  msg: string;
  data?: {
    removedFrom: {
      id: number;
      name: string;
    };
    removedAt: string;
  };
}

export interface QueueStatusResponse {
  inQueue: boolean;
  queuePosition: number | null;
  barber: {
    id: number;
    name: string;
  } | null;
  enteredAt: string | null;
}

export const userQueueService = {
  // Join a barber's queue
  async joinQueue(barberId: number): Promise<JoinQueueResponse> {
    try {
      const response = await api.post<JoinQueueResponse>("/user/joinqueue", {
        barberId,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error joining queue:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.msg ||
        "Failed to join queue";
      throw new Error(errorMessage);
    }
  },

  // Leave current queue
  async leaveQueue(): Promise<LeaveQueueResponse> {
    try {
      const response = await api.post<LeaveQueueResponse>("/user/leavequeue");
      return response.data;
    } catch (error: any) {
      console.error("Error leaving queue:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.msg ||
        "Failed to leave queue";
      throw new Error(errorMessage);
    }
  },

  // Get current queue status (simplified for now)
  async getQueueStatus(): Promise<QueueStatusResponse> {
    try {
      const response = await api.get<{ queueStatus: QueueStatusResponse }>(
        "/user/queue-status"
      );
      return response.data.queueStatus;
    } catch (error: any) {
      // If endpoint doesn't exist yet, return default status
      if (error.response?.status === 404) {
        return {
          inQueue: false,
          queuePosition: null,
          barber: null,
          enteredAt: null,
        };
      }
      console.error("Error getting queue status:", error);
      throw new Error("Failed to get queue status");
    }
  },
};
