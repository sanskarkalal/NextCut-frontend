import React from "react";
import { useAuth } from "../context/AuthContext";
import { useBarberQueue } from "../hooks/useBarberQueue";
import QueueManagement from "../components/barber/QueueManagement";
import ThemeToggle from "../components/common/ThemeToggle";

const BarberDashboard: React.FC = () => {
  const { barber, logout } = useAuth();
  const { queue, isLoading, error, refreshQueue, removeUser, removingUserId } =
    useBarberQueue(); // Changed from isRemoving to removingUserId

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-50 transition-all duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-dark-100 shadow-sm border-b border-gray-200 dark:border-dark-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-title">NextCut</h1>
              <p className="text-sm text-subtitle">Barber Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-body hidden sm:inline">
                Welcome, {barber?.name}
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
        <QueueManagement
          queue={queue}
          isLoading={isLoading}
          error={error}
          onRefresh={refreshQueue}
          onRemoveUser={removeUser}
          removingUserId={removingUserId} // Changed from isRemoving to removingUserId
        />
      </div>
    </div>
  );
};

export default BarberDashboard;
