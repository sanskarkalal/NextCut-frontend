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

  return (
    <div className="card queue-status-card shadow-lg dark:shadow-dark-xl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center shadow-lg dark:shadow-glow-blue">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-title animate-pulse-slow">
              You're in Queue!
            </h3>
            <p className="text-sm text-subtitle">
              {queueStatus.barber?.name || "Unknown Barber"}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 text-muted hover:text-body transition-all duration-200 hover:scale-110"
          title="Refresh status"
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center stat-card-primary rounded-lg p-3">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {queueStatus.queuePosition || 1}
          </div>
          <div className="text-sm text-muted">Position</div>
        </div>

        <div className="text-center stat-card-warning rounded-lg p-3">
          <div className="text-2xl font-bold text-orange-600 dark:text-amber-400">
            {estimatedWaitTime}m
          </div>
          <div className="text-sm text-muted">Est. Wait</div>
        </div>

        <div className="text-center stat-card-success rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600 dark:text-emerald-400">
            {waitingSince}m
          </div>
          <div className="text-sm text-muted">Waiting</div>
        </div>

        <div className="text-center stat-card-purple rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600 dark:text-purple-400">
            {queueStatus.queuePosition === 1 ? "Next!" : "Waiting"}
          </div>
          <div className="text-sm text-muted">Status</div>
        </div>
      </div>

      {queueStatus.queuePosition === 1 && (
        <div className="status-success rounded-lg p-4 mb-4 animate-glow">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-600 dark:text-emerald-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium text-green-900 dark:text-emerald-300">
                You're Next!
              </p>
              <p className="text-sm text-green-700 dark:text-emerald-400">
                Please head to the barber shop now.
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onLeaveQueue}
        disabled={isLeaving}
        className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-dark-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl dark:hover:shadow-glow-pink transform hover:scale-105"
      >
        {isLeaving ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Leaving Queue...
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
                d="M6 18L18 6M6 6l12 12"
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
