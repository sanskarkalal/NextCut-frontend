import React, { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../hooks/useLocation";
import { useUserQueue } from "../hooks/useUserQueue";
import LocationPicker from "../components/user/LocationPicker";
import NearbyBarbers from "../components/user/NearbyBarbers";
import QueueStatusComponent from "../components/user/QueueStatus";
import ServiceSelection from "../components/user/ServiceSelection";
import ThemeToggle from "../components/common/ThemeToggle";
import type { Barber, ServiceType } from "../types";

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [showServiceSelection, setShowServiceSelection] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);

  // Location hook with enhanced auto-refresh
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
    forceRefreshBarbers,
  } = useLocation();

  // Callback for when user exits queue
  const handleQueueExit = useCallback(async () => {
    // Force refresh barber list with updated queue lengths
    await forceRefreshBarbers();

    // Scroll to barber list after a short delay
    setTimeout(() => {
      const barberListElement = document.getElementById("barber-list");
      if (barberListElement) {
        barberListElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 1000);
  }, [forceRefreshBarbers]);

  // Queue hook with enhanced navigation - pass the callback
  const {
    queueStatus,
    isLoading: isQueueLoading,
    isJoining,
    isLeaving,
    joinQueue,
    leaveQueue,
    refreshStatus,
    getEstimatedWaitTime,
  } = useUserQueue(handleQueueExit);

  // Handle barber selection - show service selection modal
  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    setShowServiceSelection(true);
  };

  // Handle service selection and join queue
  const handleServiceSelect = async (service: ServiceType) => {
    if (!selectedBarber) return;

    try {
      await joinQueue(selectedBarber.id, service, selectedBarber.name);
      setShowServiceSelection(false);
      setSelectedBarber(null);
    } catch (error) {
      console.error("Error joining queue:", error);
    }
  };

  // Handle service selection cancel
  const handleServiceCancel = () => {
    setShowServiceSelection(false);
    setSelectedBarber(null);
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
              <ThemeToggle />
              <button onClick={logout} className="btn-secondary text-sm">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Queue Status Section */}
          {queueStatus?.inQueue && (
            <div className="mb-8">
              <QueueStatusComponent
                queueStatus={queueStatus}
                isLoading={isQueueLoading}
                isLeaving={isLeaving}
                onLeaveQueue={leaveQueue}
                onRefresh={refreshStatus}
                estimatedWaitTime={getEstimatedWaitTime()}
              />
            </div>
          )}

          {/* Location Section */}
          {!queueStatus?.inQueue && (
            <>
              {!hasLocationPermission && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 mr-3"
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
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Find Nearby Barbers
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300 mb-4">
                        To show you the closest barber shops, we need access to
                        your location.
                      </p>
                      <LocationPicker
                        isLoading={isLoadingLocation}
                        error={locationError}
                        onRequestLocation={requestLocation}
                        onClearError={clearLocationError} locationError={null} isLoadingLocation={false}                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Barbers List */}
              {location && (
                <div id="barber-list">
                  <NearbyBarbers
                    barbers={nearbyBarbers}
                    isLoading={isLoadingBarbers}
                    error={barbersError}
                    onRefresh={refreshBarbers}
                    onJoinQueue={handleBarberSelect}
                    isJoining={isJoining}
                    userLocation={location}
                    userInQueue={queueStatus?.inQueue || false}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Service Selection Modal */}
      {showServiceSelection && selectedBarber && (
        <ServiceSelection
          barberName={selectedBarber.name}
          onSelect={handleServiceSelect}
          onCancel={handleServiceCancel}
          isLoading={isJoining === selectedBarber.id}
        />
      )}
    </div>
  );
};

export default UserDashboard;
