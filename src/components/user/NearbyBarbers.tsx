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
  isJoining: boolean;
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
          <p className="text-gray-600 mt-4">Finding nearby barbers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Barbers
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
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
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
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
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Barbers Found
          </h3>
          <p className="text-gray-600 mb-4">
            No barbers found within 5km of your location. Try expanding your
            search area or check back later.
          </p>
          <button onClick={onRefresh} className="btn-outline">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Nearby Barbers ({barbers.length})
        </h2>
        <button
          onClick={onRefresh}
          className="btn-secondary flex items-center space-x-2"
        >
          <svg
            className="w-4 h-4"
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {barbers.map((barber) => (
          <BarberCard
            key={barber.id}
            barber={barber}
            onJoinQueue={onJoinQueue}
            userLocation={userLocation}
            isJoining={isJoining}
            userInQueue={userInQueue}
          />
        ))}
      </div>
    </div>
  );
};

interface BarberCardProps {
  barber: Barber;
  onJoinQueue: (barber: Barber) => void;
  userLocation: { lat: number; long: number } | null;
  isJoining: boolean;
  userInQueue: boolean;
}

const BarberCard: React.FC<BarberCardProps> = ({
  barber,
  onJoinQueue,
  userLocation,
  isJoining,
  userInQueue,
}) => {
  const distance = userLocation
    ? locationService.calculateDistance(
        userLocation.lat,
        userLocation.long,
        barber.lat,
        barber.long
      )
    : barber.distanceKm;

  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{barber.name}</h3>
            <p className="text-sm text-gray-600">@{barber.username}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center text-sm text-gray-500">
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
            {distance ? locationService.formatDistance(distance) : "N/A"}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Available
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Queue:</span>
          <span className="text-gray-900 font-medium">0 waiting</span>
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
            "Join Queue"
          )}
        </button>
      </div>
    </div>
  );
};

export default NearbyBarbers;
