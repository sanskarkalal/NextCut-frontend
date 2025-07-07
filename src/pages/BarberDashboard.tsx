import React from "react";
import { useAuth } from "../context/AuthContext";
import { useBarberQueue } from "../hooks/useBarberQueue";
import QueueManagement from "../components/barber/QueueManagement";

const BarberDashboard: React.FC = () => {
  const { barber, logout } = useAuth();
  const { queue, isLoading, error, refreshQueue, removeUser, isRemoving } =
    useBarberQueue();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NextCut</h1>
              <p className="text-sm text-gray-600">Barber Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 hidden sm:inline">
                Welcome, {barber?.name}
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
        <QueueManagement
          queue={queue}
          isLoading={isLoading}
          error={error}
          onRefresh={refreshQueue}
          onRemoveUser={removeUser}
          isRemoving={isRemoving}
        />
      </div>
    </div>
  );
};

export default BarberDashboard;
