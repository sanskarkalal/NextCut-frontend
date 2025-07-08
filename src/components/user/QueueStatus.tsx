import React from "react";
import { type QueueStatusResponse } from "../../services/userQueueService";
import LoadingSpinner from "../common/LoadingSpinner";

interface QueueStatusProps {
  queueStatus: QueueStatusResponse;
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
  // Calculate how long user has been waiting
  const waitingSince = queueStatus.enteredAt
    ? Math.floor(
        (Date.now() - new Date(queueStatus.enteredAt).getTime()) / (1000 * 60)
      )
    : 0;

  // Format wait time helper
  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Get position-based message
  const getPositionMessage = () => {
    if (!queueStatus.queuePosition) return "";

    if (queueStatus.queuePosition === 1) {
      return "🎉 You're next in line!";
    } else if (queueStatus.queuePosition === 2) {
      return "Almost there! You're second in line.";
    } else if (queueStatus.queuePosition <= 3) {
      return "You're very close to your turn!";
    } else {
      return `${queueStatus.queuePosition - 1} people ahead of you.`;
    }
  };

  // Get status color based on position
  const getStatusColor = () => {
    if (!queueStatus.queuePosition) return "text-blue-600 dark:text-blue-400";

    if (queueStatus.queuePosition === 1) {
      return "text-green-600 dark:text-green-400";
    } else if (queueStatus.queuePosition <= 3) {
      return "text-yellow-600 dark:text-yellow-400";
    } else {
      return "text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <div className="card bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200 dark:border-primary-700">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-title flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span>In Queue - {queueStatus.barber?.name}</span>
          </h2>
          <p className={`text-lg font-medium ${getStatusColor()}`}>
            {getPositionMessage()}
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
          title="Refresh queue status"
        >
          <svg
            className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
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

      {/* Position Display */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div
            className={`w-20 h-20 ${
              queueStatus.queuePosition === 1
                ? "bg-green-600 dark:bg-green-500 animate-pulse"
                : "bg-primary-600 dark:bg-primary-500"
            } rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl`}
          >
            {queueStatus.queuePosition || "?"}
          </div>
          {queueStatus.queuePosition === 1 && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-yellow-800 text-xl">👑</span>
            </div>
          )}
        </div>
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
          <div className="w-full bg-gray-200 dark:bg-dark-300 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-600 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${Math.max(
                  10,
                  100 - (queueStatus.queuePosition - 1) * 15
                )}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Next in line special message */}
      {queueStatus.queuePosition === 1 && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                You're next! Please stay nearby.
              </p>
              <p className="text-sm text-green-600 dark:text-green-300">
                {queueStatus.barber?.name} will call you soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Auto-refresh notice */}
      <div className="bg-gray-50 dark:bg-dark-200 rounded-lg p-3 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span>
            Auto-updating every 10 seconds • You'll get notifications when your
            position changes
          </span>
        </div>
      </div>

      {/* Leave queue button */}
      <button
        onClick={onLeaveQueue}
        disabled={isLeaving}
        className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-dark-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        {isLeaving ? (
          <>
            <LoadingSpinner size="sm" />
            <span className="ml-2">Leaving queue...</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 mr-2"
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
