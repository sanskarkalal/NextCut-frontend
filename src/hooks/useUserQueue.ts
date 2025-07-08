// src/hooks/useUserQueue.ts - Corrected version
import { useState, useEffect, useCallback, useRef } from "react";
import {
  userQueueService,
  type QueueStatusResponse,
} from "../services/userQueueService";
import toast from "react-hot-toast";
import { queueNotifications } from "../utils/queueNotifications";

interface UseUserQueueReturn {
  queueStatus: QueueStatusResponse | null;
  isLoading: boolean;
  isJoining: number | null; // Now stores barberId being joined
  isLeaving: boolean;
  error: string | null;
  joinQueue: (barberId: number, barberName: string) => Promise<void>;
  leaveQueue: () => Promise<void>;
  refreshStatus: () => void;
  getEstimatedWaitTime: () => number; // in minutes
  onQueueExit: () => void; // callback for when user exits queue
}

export const useUserQueue = (
  onQueueExit?: () => void // callback prop for refreshing barber list
): UseUserQueueReturn => {
  const [queueStatus, setQueueStatus] = useState<QueueStatusResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isJoining, setIsJoining] = useState<number | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref to track previous queue position for notifications
  const previousPosition = useRef<number | null>(null);
  const previousBarberName = useRef<string | null>(null);
  const wasInQueue = useRef<boolean>(false); // Track if user was previously in queue

  // Fetch current queue status from the backend
  const fetchQueueStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const status = await userQueueService.getQueueStatus();

      // Check for position changes and notify user
      if (status.inQueue && status.queuePosition !== null) {
        const currentPosition = status.queuePosition;
        const prevPosition = previousPosition.current;
        const barberName = status.barber?.name || "Unknown Barber";

        // Store current barber name for notifications
        previousBarberName.current = barberName;

        // Only notify if this isn't the first load and position changed
        if (prevPosition !== null && prevPosition !== currentPosition) {
          if (currentPosition < prevPosition) {
            // Position improved (moved up in queue)
            const positionsMoved = prevPosition - currentPosition;

            if (currentPosition === 1) {
              // User is now next in line - play special sound and show notification
              toast.success(
                `🎉 You're next! ${barberName} will see you soon.`,
                {
                  duration: 8000, // Show longer for next in line
                  style: {
                    background: "#10B981",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bold",
                  },
                }
              );

              // Show notification with sound
              if (
                queueNotifications.isSupported() &&
                queueNotifications.isPermissionGranted()
              ) {
                queueNotifications.show(
                  "🎉 You're Next in Line!",
                  `${barberName} will see you soon. Please stay nearby!`,
                  "next"
                );
              } else {
                // Play sound even if notifications aren't enabled
                queueNotifications.playSound("next");
              }
            } else {
              // General position improvement
              toast.success(
                `📈 You moved up ${positionsMoved} position${
                  positionsMoved > 1 ? "s" : ""
                }! Now #${currentPosition} in ${barberName}'s queue.`,
                {
                  duration: 4000,
                }
              );

              // Show notification
              if (
                queueNotifications.isSupported() &&
                queueNotifications.isPermissionGranted()
              ) {
                queueNotifications.show(
                  "Queue Update",
                  `You moved up ${positionsMoved} position${
                    positionsMoved > 1 ? "s" : ""
                  }! Now #${currentPosition}`,
                  "update"
                );
              }
            }
          } else if (currentPosition > prevPosition) {
            // Position got worse (moved down in queue) - rare but possible
            const positionsLost = currentPosition - prevPosition;
            toast.error(
              `📉 You moved down ${positionsLost} position${
                positionsLost > 1 ? "s" : ""
              } to #${currentPosition}. Someone may have joined ahead.`
            );
          }
        }

        // Update the previous position for next comparison
        previousPosition.current = currentPosition;
        wasInQueue.current = true;
      } else if (!status.inQueue) {
        // User left queue logic
        if (wasInQueue.current) {
          // User was in queue but now isn't - they were served or left
          toast.success(
            `🎉 You've left the queue! ${
              previousBarberName.current
                ? `Thanks for visiting ${previousBarberName.current}!`
                : "Hope you had a great experience!"
            }`,
            {
              duration: 6000,
              style: {
                background: "#10B981",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
              },
            }
          );

          // Show notification for being served
          if (
            queueNotifications.isSupported() &&
            queueNotifications.isPermissionGranted()
          ) {
            queueNotifications.show(
              "🎉 Your Turn!",
              `${
                previousBarberName.current || "The barber"
              } is ready to serve you!`,
              "removed"
            );
          }

          // Reset tracking
          previousPosition.current = null;
          previousBarberName.current = null;
          wasInQueue.current = false;

          // Trigger callback to refresh barber list
          if (onQueueExit) {
            onQueueExit();
          }
        }
      }

      setQueueStatus(status);
    } catch (error: any) {
      console.error("Error fetching queue status:", error);
      setError(error.message || "Failed to fetch queue status");
    } finally {
      setIsLoading(false);
    }
  }, [onQueueExit]);

  // Join a queue
  const joinQueue = useCallback(
    async (barberId: number, barberName: string) => {
      setIsJoining(barberId);
      setError(null);

      try {
        await userQueueService.joinQueue(barberId);
        toast.success(`Successfully joined ${barberName}'s queue!`);

        // Request notification permission when joining queue
        if (
          queueNotifications.isSupported() &&
          !queueNotifications.isPermissionGranted()
        ) {
          const permission = await queueNotifications.requestPermission();
          if (permission === "granted") {
            toast.success(
              "✅ Notifications enabled! You'll get updates about your queue position."
            );
          }
        } else if (queueNotifications.isPermissionGranted()) {
          // Initialize service worker if permission already granted
          await queueNotifications.init();
        }

        // Refresh status to get updated position
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

      // Reset tracking when leaving
      previousPosition.current = null;
      previousBarberName.current = null;
      wasInQueue.current = false;

      // Refresh status
      await fetchQueueStatus();

      // Trigger callback to refresh barber list after leaving
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
    if (!queueStatus?.inQueue || !queueStatus.queuePosition) {
      return 0;
    }

    // Assume 15 minutes per person ahead
    return (queueStatus.queuePosition - 1) * 15;
  }, [queueStatus]);

  // Handle queue exit callback
  const handleQueueExit = useCallback(() => {
    if (onQueueExit) {
      onQueueExit();
    }
  }, [onQueueExit]);

  // Initial fetch on mount
  useEffect(() => {
    fetchQueueStatus();
  }, [fetchQueueStatus]);

  // Enhanced polling: More frequent updates when in queue
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (queueStatus?.inQueue) {
      // Poll every 5 seconds when in queue for faster updates
      interval = setInterval(() => {
        fetchQueueStatus();
      }, 5000);
    } else {
      // Poll every 30 seconds when not in queue
      interval = setInterval(() => {
        fetchQueueStatus();
      }, 30000);
    }

    return () => clearInterval(interval);
  }, [fetchQueueStatus, queueStatus?.inQueue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      previousPosition.current = null;
      previousBarberName.current = null;
      wasInQueue.current = false;
    };
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
    onQueueExit: handleQueueExit,
  };
};
