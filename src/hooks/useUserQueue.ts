// src/hooks/useUserQueue.ts
import { useState, useEffect, useCallback } from "react";
import { userQueueService } from "../services/userQueueService";
import type { ServiceType, QueueStatus } from "../types";
import toast from "react-hot-toast";

interface UseUserQueueReturn {
  queueStatus: QueueStatus | null;
  isLoading: boolean;
  isJoining: number | null;
  isLeaving: boolean;
  error: string | null;
  joinQueue: (
    barberId: number,
    service: ServiceType,
    barberName: string
  ) => Promise<void>;
  leaveQueue: () => Promise<void>;
  refreshStatus: () => void;
  getEstimatedWaitTime: () => number;
}

export const useUserQueue = (onQueueExit?: () => void): UseUserQueueReturn => {
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isJoining, setIsJoining] = useState<number | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current queue status
  const fetchQueueStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const status = await userQueueService.getQueueStatus();
      setQueueStatus(status);
    } catch (error: any) {
      console.error("Error fetching queue status:", error);
      setError(error.message || "Failed to fetch queue status");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Join a queue with service selection
  const joinQueue = useCallback(
    async (barberId: number, service: ServiceType, barberName: string) => {
      setIsJoining(barberId);
      setError(null);

      try {
        await userQueueService.joinQueue(barberId, service);
        toast.success(
          `Successfully joined ${barberName}'s queue for ${service}!`
        );
        await fetchQueueStatus();
      } catch (error: any) {
        const errorMessage = error.message || "Failed to join queue";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsJoining(null);
      }
    },
    [fetchQueueStatus]
  );

  // Leave current queue
  const leaveQueue = useCallback(async () => {
    setIsLeaving(true);
    setError(null);

    try {
      await userQueueService.leaveQueue();
      toast.success("Successfully left the queue");
      await fetchQueueStatus();

      if (onQueueExit) {
        onQueueExit();
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to leave queue";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLeaving(false);
    }
  }, [fetchQueueStatus, onQueueExit]);

  // Manual refresh
  const refreshStatus = useCallback(() => {
    fetchQueueStatus();
  }, [fetchQueueStatus]);

  // Calculate estimated wait time
  const getEstimatedWaitTime = useCallback(() => {
    if (!queueStatus?.inQueue || !queueStatus.estimatedWaitTime) {
      return 0;
    }
    return queueStatus.estimatedWaitTime;
  }, [queueStatus]);

  // Initial fetch on mount
  useEffect(() => {
    fetchQueueStatus();
  }, [fetchQueueStatus]);

  // Auto-refresh polling
  useEffect(() => {
    const interval = setInterval(
      () => {
        fetchQueueStatus();
      },
      queueStatus?.inQueue ? 5000 : 30000
    );

    return () => clearInterval(interval);
  }, [fetchQueueStatus, queueStatus?.inQueue]);

  return {
    queueStatus,
    isLoading,
    isJoining,
    isLeaving,
    error,
    joinQueue,
    leaveQueue,
    refreshStatus,
    getEstimatedWaitTime,
  };
};

export default useUserQueue;
