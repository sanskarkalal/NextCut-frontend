import React, { useState } from "react";
import { type BarberQueueResponse } from "../../services/barberService";
import LoadingSpinner from "../common/LoadingSpinner";
import AddWalkinModal from "./AddWalkinModal";

interface QueueManagementProps {
  queue: BarberQueueResponse | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onRemoveUser: (userId: number, userName: string) => void;
  removingUserId: number | null;
}

const QueueManagement: React.FC<QueueManagementProps> = ({
  queue,
  isLoading,
  error,
  onRefresh,
  onRemoveUser,
  removingUserId,
}) => {
  const [showWalkinModal, setShowWalkinModal] = useState(false);

  if (isLoading && !queue) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <LoadingSpinner size="lg" />
          <p className="text-muted mt-4">Loading your queue...</p>
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
            Error Loading Queue
          </h3>
          <p className="text-muted mb-4">{error}</p>
          <button onClick={onRefresh} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Queue Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-title">Your Queue</h2>
          <p className="text-subtitle">
            {queue?.queueLength || 0} customer
            {queue?.queueLength !== 1 ? "s" : ""} waiting
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowWalkinModal(true)}
            className="btn-primary flex items-center space-x-2 hover:scale-105 transition-transform"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Add Walk-in</span>
          </button>
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
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card-primary rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center shadow-lg dark:shadow-glow-blue">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Total Wait Time</p>
              <p className="text-2xl font-bold text-green-600 dark:text-emerald-400">
                {queue?.queueLength ? `${queue.queueLength * 15}m` : "0m"}
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card-warning rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-600 dark:bg-yellow-500 rounded-full flex items-center justify-center shadow-lg dark:shadow-glow-blue">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Status</p>
              <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {queue?.queueLength ? "Active" : "Empty"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Content */}
      {!queue?.queueLength ? (
        <div className="card">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-title mb-3">
              No Customers in Queue
            </h3>
            <p className="text-muted max-w-md mx-auto">
              Customers can find you in the app and join your queue.
            </p>
          </div>
        </div>
      ) : (
        <div className="card">
          <h3 className="text-lg font-semibold text-title mb-4">
            Current Queue
          </h3>
          <div className="space-y-3">
            {queue?.queue.map((customer) => (
              <QueueCustomerCard
                key={customer.queueId}
                customer={customer}
                onRemove={onRemoveUser}
                isRemoving={removingUserId === customer.user.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Walk-in Modal */}
      {showWalkinModal && (
        <AddWalkinModal
          onClose={() => setShowWalkinModal(false)}
          onSuccess={() => {
            setShowWalkinModal(false);
            onRefresh(); // Refresh queue after adding walk-in
          }}
        />
      )}
    </div>
  );
};

interface QueueCustomerCardProps {
  customer: {
    position: number;
    queueId: number;
    user: {
      id: number;
      name: string;
      phoneNumber: string;
    };
    enteredAt: string;
    service?: string;
  };
  onRemove: (userId: number, userName: string) => void;
  isRemoving: boolean;
}

const QueueCustomerCard: React.FC<QueueCustomerCardProps> = ({
  customer,
  onRemove,
  isRemoving,
}) => {
  const enteredTime = new Date(customer.enteredAt);
  const waitTime = Math.floor(
    (Date.now() - enteredTime.getTime()) / (1000 * 60)
  ); // minutes

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-dark-300 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg dark:shadow-glow-blue">
          {customer.position}
        </div>
        <div>
          <h4 className="font-medium text-title">{customer.user.name}</h4>
          <p className="text-sm text-muted font-mono">
            📞 {customer.user.phoneNumber}
          </p>
          <p className="text-sm text-muted">
            Waiting for {waitTime < 1 ? "less than 1" : waitTime} minute
            {waitTime !== 1 ? "s" : ""}
          </p>
          {customer.service && (
            <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-1">
              {customer.service === "haircut+beard"
                ? "Haircut + Beard"
                : customer.service === "haircut"
                ? "Haircut"
                : "Beard Trim"}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <a
          href={`tel:${customer.user.phoneNumber}`}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-100 flex items-center space-x-1 shadow-lg hover:shadow-xl dark:hover:shadow-glow-blue transform hover:scale-105"
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>Call</span>
        </a>
        <button
          onClick={() => onRemove(customer.user.id, customer.user.name)}
          disabled={isRemoving}
          className="bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-dark-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl dark:hover:shadow-glow-blue transform hover:scale-105"
        >
          {isRemoving ? (
            <LoadingSpinner size="sm" className="text-white" />
          ) : (
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          <span>{isRemoving ? "Removing..." : "Done"}</span>
        </button>
      </div>
    </div>
  );
};

export default QueueManagement;
