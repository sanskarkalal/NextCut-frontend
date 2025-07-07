import React from "react";
import {type BarberQueueResponse } from "../../services/barberService";
import LoadingSpinner from "../common/LoadingSpinner";

interface QueueManagementProps {
  queue: BarberQueueResponse | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onRemoveUser: (userId: number, userName: string) => void;
  isRemoving: boolean;
}

const QueueManagement: React.FC<QueueManagementProps> = ({
  queue,
  isLoading,
  error,
  onRefresh,
  onRemoveUser,
  isRemoving,
}) => {
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

      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card-primary rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center shadow-lg dark:shadow-glow-blue">
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
              <p className="text-sm font-medium">Total Waiting</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {queue?.queueLength || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card-success rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 dark:bg-emerald-500 rounded-full flex items-center justify-center shadow-lg dark:shadow-glow-blue">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Est. Wait Time</p>
              <p className="text-2xl font-bold text-green-600 dark:text-emerald-400">
                {queue?.queueLength ? `${queue.queueLength * 20}m` : "0m"}
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card-purple rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center shadow-lg dark:shadow-glow-purple">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Status</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {queue?.queueLength ? "Active" : "Available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Queue List */}
      {queue?.queueLength === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-dark-500"
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
            <h3 className="text-lg font-medium text-title mb-2">
              No Customers Waiting
            </h3>
            <p className="text-muted">
              Your queue is empty. Customers can find you in the app and join
              your queue.
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
                isRemoving={isRemoving}
              />
            ))}
          </div>
        </div>
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
    };
    enteredAt: string;
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
          <p className="text-sm text-muted">
            Waiting for {waitTime < 1 ? "less than 1" : waitTime} minute
            {waitTime !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onRemove(customer.user.id, customer.user.name)}
          disabled={isRemoving}
          className="bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-dark-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl dark:hover:shadow-glow-blue transform hover:scale-105"
        >
          {isRemoving ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Serving...</span>
            </>
          ) : (
            <>
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
              <span>Serve Customer</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QueueManagement;
