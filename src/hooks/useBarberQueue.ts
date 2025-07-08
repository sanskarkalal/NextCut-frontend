import { useState, useEffect, useCallback } from "react";
import {
  barberService,
  type BarberQueueResponse,
} from "../services/barberService";
import toast from "react-hot-toast";

interface UseBarberQueueReturn {
  queue: BarberQueueResponse | null;
  isLoading: boolean;
  error: string | null;
  refreshQueue: () => void;
  removeUser: (userId: number, userName: string) => Promise<void>;
  removingUserId: number | null; // Track specific user being removed
}

export const useBarberQueue = (): UseBarberQueueReturn => {
  const [queue, setQueue] = useState<BarberQueueResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingUserId, setRemovingUserId] = useState<number | null>(null); // Changed from isRemoving

  // Fetch queue data
  const fetchQueue = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queueData = await barberService.getQueue();
      setQueue(queueData);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch queue";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh queue manually
  const refreshQueue = useCallback(() => {
    fetchQueue();
  }, [fetchQueue]);

  // Remove user from queue
  const removeUser = useCallback(
    async (userId: number, userName: string) => {
      setRemovingUserId(userId); // Set specific user being removed

      try {
        const response = await barberService.removeUserFromQueue(userId);
        toast.success(response.msg || `${userName} removed from queue`);

        // Refresh queue after successful removal
        await fetchQueue();
      } catch (error: any) {
        const errorMessage = error.message || "Failed to remove user";
        toast.error(errorMessage);
      } finally {
        setRemovingUserId(null); // Clear specific user being removed
      }
    },
    [fetchQueue]
  );

  // Initial fetch on mount
  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchQueue();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchQueue]);

  return {
    queue,
    isLoading,
    error,
    refreshQueue,
    removeUser,
    removingUserId, // Return specific user ID being removed
  };
};
