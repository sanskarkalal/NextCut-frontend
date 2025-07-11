// src/components/user/QueueStatus.tsx
import React from "react";
import type { QueueStatus } from "../../types";
import LoadingSpinner from "../common/LoadingSpinner";

interface QueueStatusProps {
  queueStatus: QueueStatus;
  estimatedWaitTime: number;
  isLoading: boolean;
  isLeaving: boolean;
  onLeaveQueue: () => void;
  onRefresh: () => void;
}

const QueueStatusComponent: React.FC<QueueStatusProps> = ({
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

  // Get service display info
  const getServiceInfo = () => {
    if (!queueStatus.service) return { name: "Service", icon: "✂️" };

    const serviceMap = {
      haircut: { name: "Haircut", icon: "✂️" },
      beard: { name: "Beard Trim", icon: "🧔" },
      "haircut+beard": { name: "Haircut + Beard", icon: "✂️🧔" },
    };

    return serviceMap[queueStatus.service] || serviceMap["haircut"];
  };

  const serviceInfo = getServiceInfo();

  if (!queueStatus.inQueue) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">You're in Queue!</h2>
          <p className="text-primary-100">
            {queueStatus.barber?.name || "Unknown Barber"}
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
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

      {/* Position Message */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold mb-2">
          #{queueStatus.queuePosition}
        </div>
        <div className="text-lg mb-2">{getPositionMessage()}</div>
        <div className="text-sm text-primary-100 flex items-center justify-center">
          <span className="mr-2">{serviceInfo.icon}</span>
          <span>{serviceInfo.name}</span>
          {queueStatus.queuePosition === 1
            ? " • Please stay nearby - you're next!"
            : ` • About ${formatWaitTime(estimatedWaitTime)} estimated wait`}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-white/10 rounded-lg">
          <div className="text-2xl font-bold">
            {formatWaitTime(waitingSince)}
          </div>
          <div className="text-sm text-primary-100">Time Waiting</div>
        </div>
        <div className="text-center p-4 bg-white/10 rounded-lg">
          <div className="text-2xl font-bold">
            {formatWaitTime(estimatedWaitTime)}
          </div>
          <div className="text-sm text-primary-100">Est. Wait Time</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        {queueStatus.barber?.lat && queueStatus.barber?.long && (
          <button
            onClick={() => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${
                queueStatus.barber!.lat
              },${queueStatus.barber!.long}`;
              window.open(url, "_blank");
            }}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Get Directions
          </button>
        )}
        <button
          onClick={onLeaveQueue}
          disabled={isLeaving}
          className={`${
            queueStatus.barber?.lat && queueStatus.barber?.long
              ? "flex-1"
              : "w-full"
          } bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50`}
        >
          {isLeaving ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Leaving...
            </>
          ) : (
            "Leave Queue"
          )}
        </button>
      </div>
    </div>
  );
};

export default QueueStatusComponent;
