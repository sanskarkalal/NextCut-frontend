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

  // Queue hook - now returns isJoining as number | null
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
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-title">NextCut</h1>
              <div className="text-subtitle">
                Welcome back, {user?.name || "User"}!
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Show queue indicator in header if user is in queue */}
              {queueStatus?.inQueue && (
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                    Position #{queueStatus.queuePosition} with{" "}
                    {queueStatus.barber?.name}
                  </span>
                </div>
              )}

              <ThemeToggle />
              <button
                onClick={logout}
                className="btn-secondary text-sm hover:scale-105 transition-transform"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
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

          {/* Location Picker - Show if user doesn't have location permission */}
          {!hasLocationPermission && (
            <LocationPicker
              onRequestLocation={requestLocation}
              isLoading={isLoadingLocation}
              error={locationError}
              onClearError={clearLocationError}
              locationError={null}
              isLoadingLocation={false}
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
              isJoining={isJoining} // Now passes barberId | null
              userLocation={location}
              userInQueue={false}
            />
          )}

          {/* Show enhanced message if user is in queue */}
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
              <p className="text-muted mb-4">
                You'll get real-time updates about your position with sound
                notifications. Updates happen every 5 seconds to keep you
                informed even when you're not actively using the app.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>5-second updates</span>
                </div>
                <div className="flex items-center space-x-1">
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
                      d="M15 17h5l-5 5v-5zM4.5 5.653c0-1.426 1.67-2.16 2.598-1.14l15 16.5c.929 1.021.194 2.654-1.141 2.654H4.5c-.83 0-1.5-.67-1.5-1.5V5.653z"
                    />
                  </svg>
                  <span>Push notifications</span>
                </div>
                <div className="flex items-center space-x-1">
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
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M6.343 6.343a9 9 0 000 12.728m2.829-9.9a5 5 0 000 7.072"
                    />
                  </svg>
                  <span>Sound alerts</span>
                </div>
              </div>
            </div>
          )}

          {/* Show helpful tips when not in queue */}
          {!queueStatus?.inQueue && hasLocationPermission && location && (
            <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    How NextCut Works
                  </h3>
                  <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      <span>Join any barber's queue with a single tap</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      <span>Get real-time updates about your position</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      <span>
                        Receive notifications when it's almost your turn
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      <span>
                        Skip the physical wait - do other things nearby!
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
