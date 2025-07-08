import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../hooks/useLocation";
import { useUserQueue } from "../hooks/useUserQueue";
import LocationPicker from "../components/user/LocationPicker";
import NearbyBarbers from "../components/user/NearbyBarbers";
import QueueStatus from "../components/user/QueueStatus";
import ThemeToggle from "../components/common/ThemeToggle";
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
    isLoading: isQueueLoading,
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
      // Queue status will be automatically refreshed after joining
    } catch (error) {
      console.error("Error joining queue:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-50 transition-all duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-dark-100 shadow-sm border-b border-gray-200 dark:border-dark-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-title">NextCut</h1>
              <p className="text-sm text-subtitle">Customer Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-body hidden sm:inline">
                Welcome, {user?.name}
              </span>
              <ThemeToggle />
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
              isLoading={isQueueLoading}
              isLeaving={isLeaving}
              onLeaveQueue={leaveQueue}
              onRefresh={refreshStatus}
            />
          )}

          {/* Location Picker - Show if no location or user is not in queue */}
          {(!hasLocationPermission || !location) && !queueStatus?.inQueue && (
            <LocationPicker
              locationError={locationError}
              isLoadingLocation={isLoadingLocation}
              onRequestLocation={requestLocation}
              onClearError={clearLocationError}
              isLoading={false}
              error={null}
            />
          )}

          {/* Nearby Barbers - Show if user has location and is not in queue */}
          {hasLocationPermission && location && !queueStatus?.inQueue && (
            <NearbyBarbers
              barbers={nearbyBarbers}
              isLoading={isLoadingBarbers}
              error={barbersError}
              onRefresh={refreshBarbers}
              onJoinQueue={handleJoinQueue}
              isJoining={isJoining}
              userLocation={location}
              userInQueue={false}
            />
          )}

          {/* Show message if user is in queue */}
          {queueStatus?.inQueue && (
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600 dark:text-primary-400"
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
              <h3 className="text-lg font-medium text-title mb-2">
                You're in {queueStatus.barber?.name}'s Queue!
              </h3>
              <p className="text-muted">
                You can leave the queue anytime using the button above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
