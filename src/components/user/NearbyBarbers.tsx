import React from "react";
import { type Barber } from "../../types";
import { locationService } from "../../services/location";
import LoadingSpinner from "../common/LoadingSpinner";

interface NearbyBarbersProps {
  barbers: Barber[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onJoinQueue: (barber: Barber) => void;
  userLocation: { lat: number; long: number } | null;
  isJoining: number | null; // Now stores barberId being joined
  userInQueue: boolean;
}

const NearbyBarbers: React.FC<NearbyBarbersProps> = ({
  barbers,
  isLoading,
  error,
  onRefresh,
  onJoinQueue,
  userLocation,
  isJoining,
  userInQueue,
}) => {
  if (isLoading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <LoadingSpinner size="lg" />
          <p className="text-muted mt-4">Finding nearby barbers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-title mb-2">
            Error Loading Barbers
          </h3>
          <p className="text-muted mb-4">{error}</p>
          <button onClick={onRefresh} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (barbers.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-dark-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-dark-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-title mb-2">
            No Barbers Found
          </h3>
          <p className="text-muted mb-4">
            No barbers found in your area. Try expanding the search radius or
            check back later.
          </p>
          <button onClick={onRefresh} className="btn-primary">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Format wait time helper
  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-title">Nearby Barbers</h2>
          <p className="text-subtitle">
            {barbers.length} barber{barbers.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="btn-secondary flex items-center space-x-2 hover:scale-105 transition-transform"
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
          <span>Refresh</span>
        </button>
      </div>

      {/* Barbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barbers.map((barber) => {
          // Check if this specific barber is being joined
          const isJoiningThisBarber = isJoining === barber.id;

          return (
            <BarberCard
              key={barber.id}
              barber={barber}
              onJoinQueue={onJoinQueue}
              isJoining={isJoiningThisBarber} // Pass specific loading state
              userInQueue={userInQueue}
              userLocation={userLocation}
              formatWaitTime={formatWaitTime}
            />
          );
        })}
      </div>
    </div>
  );
};

// Separate BarberCard component for cleaner code
interface BarberCardProps {
  barber: Barber;
  onJoinQueue: (barber: Barber) => void;
  isJoining: boolean;
  userInQueue: boolean;
  userLocation: { lat: number; long: number } | null;
  formatWaitTime: (minutes: number) => string;
}

const BarberCard: React.FC<BarberCardProps> = ({
  barber,
  onJoinQueue,
  isJoining,
  userInQueue,
  userLocation,
  formatWaitTime,
}) => {
  // Calculate distance if user location is available
  const distance = userLocation
    ? locationService.calculateDistance(
        userLocation.lat,
        userLocation.long,
        barber.lat,
        barber.long
      )
    : null;

  return (
    <div className="card hover:shadow-lg dark:hover:shadow-dark-xl transition-all duration-200 border border-gray-200 dark:border-dark-300 hover:border-primary-300 dark:hover:border-primary-600">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-title mb-1">
              {barber.name}
            </h3>
            {distance !== null && (
              <div className="flex items-center text-sm text-muted">
                <svg
                  className="w-4 h-4 mr-1"
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
                {distance.toFixed(1)} km away
              </div>
            )}
          </div>

          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              (barber.queueLength || 0) === 0
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            }`}
          >
            {(barber.queueLength || 0) === 0 ? "Available" : "Busy"}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Queue:</span>
          <div className="text-right">
            <div className="text-body font-medium">
              {barber.queueLength || 0} waiting
            </div>
            {(barber.queueLength || 0) > 0 && (
              <div className="text-xs text-muted">
                ~{formatWaitTime(barber.estimatedWaitTime || 0)} wait
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onJoinQueue(barber)}
          disabled={isJoining || userInQueue}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isJoining ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Joining...
            </>
          ) : userInQueue ? (
            "Already in Queue"
          ) : (
            <>
              Join Queue
              {(barber.queueLength || 0) > 0 && (
                <span className="ml-2 text-xs opacity-75">
                  (#{(barber.queueLength || 0) + 1})
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NearbyBarbers;
