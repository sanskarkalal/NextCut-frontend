import api from "../services/api";
import type { ServiceType } from "../types";

export interface JoinQueueResponse {
  msg: string;
  queue: {
    id: number;
    enteredAt: string;
    barberId: number;
    userId: number;
    service: ServiceType;
    user: {
      id: number;
      name: string;
      phoneNumber: string;
    };
    barber: {
      id: number;
      name: string;
      lat?: number;
      long?: number;
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
    lat?: number;
    long?: number;
  } | null;
  enteredAt: string | null;
  service: ServiceType | null;
  estimatedWaitTime: number | null; // in minutes
}

export const userQueueService = {
  // Join a barber's queue with service selection
  async joinQueue(
    barberId: number,
    service: ServiceType
  ): Promise<JoinQueueResponse> {
    try {
      const response = await api.post<JoinQueueResponse>("/user/joinqueue", {
        barberId,
        service,
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

  // Get current queue status with service info
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
          service: null,
          estimatedWaitTime: null,
        };
      }
      console.error("Error getting queue status:", error);
      throw new Error("Failed to get queue status");
    }
  },

  // Get nearby barbers with updated queue info
  async getNearbyBarbers(lat: number, long: number, radius: number = 10) {
    try {
      const response = await api.post("/user/barbers", {
        lat,
        long,
        radius,
      });
      return response.data.barbers;
    } catch (error: any) {
      console.error("Error getting nearby barbers:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.msg ||
        "Failed to get nearby barbers";
      throw new Error(errorMessage);
    }
  },

  // Helper function to calculate service-based wait time
  calculateServiceWaitTime(
    queueEntries: Array<{ service: ServiceType }>
  ): number {
    const serviceTimes = {
      haircut: 20,
      beard: 5,
      "haircut+beard": 25,
    };

    return queueEntries.reduce((total, entry) => {
      return total + (serviceTimes[entry.service] || 20);
    }, 0);
  },

  // Helper function to format wait time
  formatWaitTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  },

  // Helper function to get service display info
  getServiceInfo(service: ServiceType) {
    const serviceMap = {
      haircut: { name: "Haircut", duration: 20, icon: "✂️" },
      beard: { name: "Beard Trim", duration: 5, icon: "🧔" },
      "haircut+beard": { name: "Haircut + Beard", duration: 25, icon: "✂️🧔" },
    };
    return serviceMap[service] || serviceMap["haircut"];
  },
};
