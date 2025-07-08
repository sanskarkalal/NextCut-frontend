// src/components/user/QueueStatus.tsx - Enhanced with Get Directions
import React from "react";
import { type QueueStatusResponse } from "../../services/userQueueService";
import { directionsUtils } from "../../utils/directionUtil";
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
      return `You're #${queueStatus.queuePosition} in line.`;
    }
  };

  // NEW: Handle get directions
  const handleGetDirections = () => {
    if (queueStatus.barber?.lat && queueStatus.barber?.long) {
      directionsUtils.openDirections({
        lat: queueStatus.barber.lat,
        long: queueStatus.barber.long,
        name: queueStatus.barber.name,
      });
    }
  };

  // NEW: Check if directions are available
  const canShowDirections = queueStatus.barber?.lat && queueStatus.barber?.long;

  return (
    <div className="card border-2 border-primary-200 dark:border-primary-700 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
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
            <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-100">
              In Queue
            </h2>
            <p className="text-primary-700 dark:text-primary-300 font-medium">
              {queueStatus.barber?.name}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="btn-secondary hover:scale-105 transition-transform"
          title="Refresh queue status"
        >
          <svg
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
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

      {/* Position Message */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-2">
          #{queueStatus.queuePosition}
        </div>
        <div className="text-lg text-primary-700 dark:text-primary-300 mb-2">
          {getPositionMessage()}
        </div>
        <div className="text-sm text-primary-600 dark:text-primary-400">
          {queueStatus.queuePosition === 1
            ? "Please stay nearby - you're next!"
            : `About ${formatWaitTime(estimatedWaitTime)} estimated wait`}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-white/50 dark:bg-dark-100/50 rounded-lg">
          <div className="text-2xl font-bold text-primary-900 dark:text-primary-100">
            {formatWaitTime(waitingSince)}
          </div>
          <div className="text-sm text-primary-600 dark:text-primary-400">
            Time Waiting
          </div>
        </div>
        <div className="text-center p-4 bg-white/50 dark:bg-dark-100/50 rounded-lg">
          <div className="text-2xl font-bold text-primary-900 dark:text-primary-100">
            {formatWaitTime(estimatedWaitTime)}
          </div>
          <div className="text-sm text-primary-600 dark:text-primary-400">
            Est. Remaining
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* NEW: Get Directions Button */}
        {canShowDirections && (
          <button
            onClick={handleGetDirections}
            className="btn-primary flex-1 flex items-center justify-center space-x-2 hover:scale-105 transition-transform"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{directionsUtils.getDirectionsButtonText()}</span>
          </button>
        )}

        <button
          onClick={onLeaveQueue}
          disabled={isLeaving}
          className="btn-secondary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
        >
          {isLeaving ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Leaving...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
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
              <span>Leave Queue</span>
            </>
          )}
        </button>
      </div>

      {/* Helpful Tips */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">While you wait:</p>
            <ul className="space-y-1">
              <li>• Keep notifications enabled for position updates</li>
              <li>• Stay within a reasonable distance of the barber</li>
              {canShowDirections && (
                <li>• Use directions to navigate back when it's your turn</li>
              )}
              <li>• You'll get a special alert when you're next in line</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueStatus;
