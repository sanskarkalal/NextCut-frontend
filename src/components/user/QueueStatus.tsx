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
    <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
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
            <h3 className="text-lg font-semibold text-gray-900">
              You're in Queue!
            </h3>
            <p className="text-sm text-gray-600">
              {queueStatus.barber?.name || "Unknown Barber"}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
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
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            {queueStatus.queuePosition || 1}
          </div>
          <div className="text-sm text-gray-600">Position</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {estimatedWaitTime}m
          </div>
          <div className="text-sm text-gray-600">Est. Wait</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {waitingSince}m
          </div>
          <div className="text-sm text-gray-600">Waiting</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {queueStatus.queuePosition === 1 ? "Next!" : "Waiting"}
          </div>
          <div className="text-sm text-gray-600">Status</div>
        </div>
      </div>

      {queueStatus.queuePosition === 1 && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-600 mr-2"
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
              <p className="font-medium text-green-900">You're Next!</p>
              <p className="text-sm text-green-700">
                Please head to the barber shop now.
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onLeaveQueue}
        disabled={isLeaving}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
