import { useState, useEffect, useCallback } from "react";
import {
  userQueueService,
  type QueueStatusResponse,
} from "../services/userQueueService";
import toast from "react-hot-toast";

interface UseUserQueueReturn {
  queueStatus: QueueStatusResponse | null;
  isLoading: boolean;
  isJoining: boolean;
  isLeaving: boolean;
  error: string | null;
  joinQueue: (barberId: number, barberName: string) => Promise<void>;
  leaveQueue: () => Promise<void>;
  refreshStatus: () => void;
  getEstimatedWaitTime: () => number; // in minutes
}

export const useUserQueue = (): UseUserQueueReturn => {
  const [queueStatus, setQueueStatus] = useState<QueueStatusResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current queue status from the backend
  const fetchQueueStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const status = await userQueueService.getQueueStatus();
      setQueueStatus(status);
    } catch (error: any) {
      // If user is not in queue or API error, set default status
      setQueueStatus({
        inQueue: false,
        queuePosition: null,
        barber: null,
        enteredAt: null,
      });

      // Only show error if it's not a 404 (user not in queue)
      if (!error.message.includes("404")) {
        setError(error.message || "Failed to get queue status");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Join queue
  const joinQueue = useCallback(
    async (barberId: number, barberName: string) => {
      setIsJoining(true);
      setError(null);

      try {
        const response = await userQueueService.joinQueue(barberId);
        toast.success(response.msg || `Joined ${barberName}'s queue!`);

        // Fetch the real queue status after joining
        await fetchQueueStatus();
      } catch (error: any) {
        const errorMessage = error.message || "Failed to join queue";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setIsJoining(false);
      }
    },
    [fetchQueueStatus]
  );

  // Leave queue
  const leaveQueue = useCallback(async () => {
    setIsLeaving(true);
    setError(null);

    try {
      const response = await userQueueService.leaveQueue();
      toast.success(response.msg || "Left queue successfully");

      // Clear queue status
      setQueueStatus({
        inQueue: false,
        queuePosition: null,
        barber: null,
        enteredAt: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to leave queue";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLeaving(false);
    }
  }, []);

  // Refresh status - now actually fetches from backend
  const refreshStatus = useCallback(() => {
    fetchQueueStatus();
  }, [fetchQueueStatus]);

  // Calculate estimated wait time (20 minutes per person ahead)
  const getEstimatedWaitTime = useCallback((): number => {
    if (!queueStatus?.inQueue || !queueStatus.queuePosition) {
      return 0;
    }
    // 20 minutes per person ahead (position 1 = no wait, position 2 = 20 min wait, etc.)
    return Math.max(0, (queueStatus.queuePosition - 1) * 20);
  }, [queueStatus]);

  // Load queue status when component mounts
  useEffect(() => {
    fetchQueueStatus();
  }, [fetchQueueStatus]);

  // Auto-refresh queue status every 30 seconds if user is in queue
  useEffect(() => {
    if (queueStatus?.inQueue) {
      const interval = setInterval(() => {
        fetchQueueStatus();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [queueStatus?.inQueue, fetchQueueStatus]);

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
