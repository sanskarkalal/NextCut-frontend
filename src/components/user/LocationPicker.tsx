import React from "react";
import type { LocationError } from "../../services/location";
import LoadingSpinner from "../common/LoadingSpinner";

export interface LocationPickerProps {
  locationError: LocationError | null;
  isLoadingLocation: boolean;
  isLoading: boolean;
  error: LocationError | null;
  onRequestLocation: () => void;
  onClearError: () => void;
  // ...other props...
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  isLoading,
  error,
  onRequestLocation,
  onClearError,
}) => {
  if (isLoading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <LoadingSpinner size="lg" />
          <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
            Getting Your Location
          </h3>
          <p className="text-gray-600">
            Please allow location access to find nearby barbers
          </p>
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
            Location Access {error.code === 1 ? "Denied" : "Failed"}
          </h3>

          <p className="text-gray-600 mb-6 max-w-md mx-auto">{error.message}</p>

          {error.code === 1 ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-blue-900 mb-2">
                  To enable location access:
                </h4>
                <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
                  <li>Click the location icon in your browser's address bar</li>
                  <li>Select "Allow" for location access</li>
                  <li>Refresh the page or click "Try Again"</li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    onClearError();
                    onRequestLocation();
                  }}
                  className="btn-primary"
                >
                  Try Again
                </button>
                <button onClick={onClearError} className="btn-secondary">
                  Use Manual Location
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  onClearError();
                  onRequestLocation();
                }}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-primary-600"
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
          Find Nearby Barbers
        </h3>

        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We need your location to show you barbers in your area. Your location
          is only used to find nearby services and is not stored.
        </p>

        <div className="space-y-4">
          <button onClick={onRequestLocation} className="btn-primary">
            Allow Location Access
          </button>

          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Your privacy is protected
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
