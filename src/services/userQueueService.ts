// src/services/userQueueService.ts
import api from "./api";
import type { ServiceType } from "../types";

export const userQueueService = {
  // Join a barber's queue with service selection
  async joinQueue(barberId: number, service: ServiceType) {
    try {
      const response = await api.post<{
        msg: string;
        queue: any;
      }>("/user/joinqueue", {
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
  async leaveQueue() {
    try {
      const response = await api.post<{
        msg: string;
        data?: any;
      }>("/user/leavequeue");
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
  async getQueueStatus() {
    try {
      const response = await api.get<{
        queueStatus: {
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
          estimatedWaitTime: number | null;
        };
      }>("/user/queue-status");
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
      const response = await api.post<{
        barbers: any[];
      }>("/user/barbers", {
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
};
