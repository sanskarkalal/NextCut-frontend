// ========================
// FIXED userQueueService.ts - Complete Version
// ========================
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

  // ✅ FIXED: Get current queue status with service info
  async getQueueStatus() {
    try {
      console.log("🔍 Fetching queue status...");

      const response = await api.get<{
        msg: string;
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

      console.log("✅ Queue status response:", response.data);

      // ✅ FIXED: Now correctly accessing queueStatus from response
      return response.data.queueStatus;
    } catch (error: any) {
      console.error("❌ Error getting queue status:", error);

      // If endpoint doesn't exist yet, return default status
      if (error.response?.status === 404) {
        console.log("📝 Endpoint not found, returning default status");
        return {
          inQueue: false,
          queuePosition: null,
          barber: null,
          enteredAt: null,
          service: null,
          estimatedWaitTime: null,
        };
      }

      // ✅ IMPROVED: Better error handling
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.msg ||
        error.message ||
        "Failed to get queue status";

      throw new Error(errorMessage);
    }
  },

  // Get nearby barbers with updated queue info
  async getNearbyBarbers(lat: number, long: number, radius: number = 4) {
    try {
      console.log("🔍 Fetching nearby barbers...", { lat, long, radius });

      const response = await api.post<{
        msg?: string;
        barbers: any[];
      }>("/user/barbers", {
        lat,
        long,
        radius,
      });

      console.log("✅ Nearby barbers response:", response.data);

      // ✅ FIXED: Handle both response structures
      return response.data.barbers || response.data;
    } catch (error: any) {
      console.error("❌ Error getting nearby barbers:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.msg ||
        error.message ||
        "Failed to get nearby barbers";
      throw new Error(errorMessage);
    }
  },
};
