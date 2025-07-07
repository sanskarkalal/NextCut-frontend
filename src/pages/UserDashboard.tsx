import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../hooks/useLocation";
import { useUserQueue } from "../hooks/useUserQueue";
import LocationPicker from "../components/user/LocationPicker";
import NearbyBarbers from "../components/user/NearbyBarbers";
import QueueStatus from "../components/user/QueueStatus";
import { type Barber } from "../types";

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  // Location hook
  const {
    location,
    locationError,
    isLoadingLocation,
    hasLocationPermission,
    nearbyBarbers,
    isLoadingBarbers,
    barbersError,
    requestLocation,
    refreshBarbers,
    clearLocationError,
  } = useLocation();

  // Queue hook
  const {
    queueStatus,
    isJoining,
    isLeaving,
    joinQueue,
    leaveQueue,
    refreshStatus,
    getEstimatedWaitTime,
  } = useUserQueue();

  const handleJoinQueue = async (barber: Barber) => {
    try {
      await joinQueue(barber.id, barber.name);
    } catch (error) {
      console.error("Error joining queue:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NextCut</h1>
              <p className="text-sm text-gray-600">Customer Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 hidden sm:inline">
                Welcome, {user?.name}
              </span>
              <button onClick={logout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Queue Status - Show if user is in queue */}
          {queueStatus?.inQueue && (
            <QueueStatus
              queueStatus={queueStatus}
              estimatedWaitTime={getEstimatedWaitTime()}
              isLoading={false}
              isLeaving={isLeaving}
              onLeaveQueue={leaveQueue}
              onRefresh={refreshStatus}
            />
          )}

          {/* Location Status */}
          {location && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-green-800 font-medium">
                  Location enabled: {location.lat.toFixed(6)},{" "}
                  {location.long.toFixed(6)}
                </span>
              </div>
            </div>
          )}

          {/* Location Permission or Nearby Barbers */}
          {!hasLocationPermission || locationError ? (
            <LocationPicker
              isLoading={isLoadingLocation}
              error={locationError}
              onRequestLocation={requestLocation}
              onClearError={clearLocationError}
            />
          ) : (
            <NearbyBarbers
              barbers={nearbyBarbers}
              isLoading={isLoadingBarbers}
              error={barbersError}
              onRefresh={refreshBarbers}
              onJoinQueue={handleJoinQueue}
              userLocation={location}
              isJoining={isJoining}
              userInQueue={queueStatus?.inQueue || false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
