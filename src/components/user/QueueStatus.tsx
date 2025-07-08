import React from "react";
import { type QueueStatusResponse } from "../../services/userQueueService";
import LoadingSpinner from "../common/LoadingSpinner";

interface QueueStatusProps {
  queueStatus: QueueStatusResponse | null;
  estimatedWaitTime: number;
  isLoading: boolean;
  isLeaving: boolean;
  onLeaveQueue: () => void;
  onRefresh: () => void;
}

const QueueStatus: React.FC<QueueStatusProps> = ({
  queueStatus,
  estimatedWaitTime,
  isLoading,
  isLeaving,
  onLeaveQueue,
  onRefresh,
}) => {
  if (!queueStatus?.inQueue) {
    return null;
  }

  const enteredTime = queueStatus.enteredAt
    ? new Date(queueStatus.enteredAt)
    : null;
  const waitingSince = enteredTime
    ? Math.floor((Date.now() - enteredTime.getTime()) / (1000 * 60))
    : 0;

  // Format estimated wait time
  const formatWaitTime = (minutes: number) => {
    if (minutes === 0) return "You're next!";
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Get position ordinal (1st, 2nd, 3rd, etc.)
  const getPositionOrdinal = (position: number) => {
    const lastDigit = position % 10;
    const lastTwoDigits = position % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return `${position}th`;
    }

    switch (lastDigit) {
      case 1:
        return `${position}st`;
      case 2:
        return `${position}nd`;
      case 3:
        return `${position}rd`;
      default:
        return `${position}th`;
    }
  };

  return (
    <div className="card queue-status-card shadow-lg dark:shadow-dark-xl border-2 border-primary-200 dark:border-primary-800">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center shadow-lg dark:shadow-glow-blue">
            <span className="text-2xl font-bold text-white">
              {queueStatus.queuePosition}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-title animate-pulse-slow">
              {queueStatus.queuePosition === 1
                ? "You're Next!"
                : `${getPositionOrdinal(
                    queueStatus.queuePosition || 0
                  )} in Queue`}
            </h3>
            <p className="text-subtitle font-medium">
              {queueStatus.barber?.name || "Unknown Barber"}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-3 text-muted hover:text-body transition-all duration-200 hover:scale-110 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200"
          title="Refresh status"
        >
          <svg
            className={`w-6 h-6 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
            Estimated Wait
          </div>
          <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
            {formatWaitTime(estimatedWaitTime)}
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-sm text-green-600 dark:text-green-400 mb-1">
            Waiting Since
          </div>
          <div className="text-lg font-bold text-green-700 dark:text-green-300">
            {waitingSince < 1 ? "Just now" : `${waitingSince}m ago`}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      {queueStatus.queuePosition && queueStatus.queuePosition > 1 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted mb-2">
            <span>Queue Progress</span>
            <span>{queueStatus.queuePosition - 1} people ahead</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-300 rounded-full h-2">
            <div
              className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(
                  10,
                  100 - (queueStatus.queuePosition - 1) * 20
                )}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Leave queue button */}
      <button
        onClick={onLeaveQueue}
        disabled={isLeaving}
        className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-dark-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        {isLeaving ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Leaving Queue...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Leave Queue
          </>
        )}
      </button>
    </div>
  );
};

export default QueueStatus;
