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

  // For now, we'll start with a simple implementation
  // Join queue
  const joinQueue = useCallback(
    async (barberId: number, barberName: string) => {
      setIsJoining(true);
      setError(null);

      try {
        const response = await userQueueService.joinQueue(barberId);
        toast.success(response.msg || `Joined ${barberName}'s queue!`);

        // Set basic queue status
        setQueueStatus({
          inQueue: true,
          queuePosition: 1,
          barber: { id: barberId, name: barberName },
          enteredAt: new Date().toISOString(),
        });
      } catch (error: any) {
        const errorMessage = error.message || "Failed to join queue";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setIsJoining(false);
      }
    },
    []
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

  // Refresh status (placeholder for now)
  const refreshStatus = useCallback(() => {
    // For now, we'll just log that refresh was called
    console.log("Refresh status called");
  }, []);

  // Calculate estimated wait time (20 minutes per person ahead)
  const getEstimatedWaitTime = useCallback((): number => {
    if (!queueStatus?.inQueue || !queueStatus.queuePosition) {
      return 0;
    }
    // 20 minutes per person ahead (position 1 = no wait, position 2 = 20 min wait, etc.)
    return Math.max(0, (queueStatus.queuePosition - 1) * 20);
  }, [queueStatus]);

  // Initialize with not in queue
  useEffect(() => {
    setQueueStatus({
      inQueue: false,
      queuePosition: null,
      barber: null,
      enteredAt: null,
    });
  }, []);

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
