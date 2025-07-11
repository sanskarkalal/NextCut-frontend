import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import type { SignupData, UserRole } from "../../types";
import { locationService } from "../../services/location";
import LoadingSpinner from "../common/LoadingSpinner";

interface SignupFormProps {
  role: UserRole;
  onSwitchToLogin: () => void;
}

interface FormData extends SignupData {
  confirmPassword?: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ role, onSwitchToLogin }) => {
  const { signup, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [barberLocation, setBarberLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const password = watch("password");

  // Request location for barber signup
  const requestBarberLocation = async () => {
    setIsLocationLoading(true);
    setLocationError(null);

    try {
      const coords = await locationService.getCurrentLocation();
      setBarberLocation(coords);
      setValue("lat", coords.lat);
      setValue("long", coords.long);
    } catch (error: any) {
      setLocationError(error.message);
    } finally {
      setIsLocationLoading(false);
    }
  };

  // Auto-request location when component mounts for barber
  useEffect(() => {
    if (role === "BARBER") {
      requestBarberLocation();
    }
  }, [role]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // For barber, ensure location is available
      if (role === "BARBER" && !barberLocation) {
        setLocationError(
          "Location is required for barber registration. Please allow location access."
        );
        return;
      }

      const signupData: SignupData = {
        name: data.name,
      };

      if (role === "USER") {
        // User signup: phone number + name only
        signupData.phoneNumber = data.phoneNumber;
      } else {
        // Barber signup: all fields including location
        signupData.username = data.username;
        signupData.password = data.password;
        signupData.lat = barberLocation!.lat;
        signupData.long = barberLocation!.long;
      }

      await signup(signupData, role);
    } catch (error) {
      // Error handling is done in the context
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled =
    loading || isSubmitting || (role === "BARBER" && isLocationLoading);

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create Account
        </h2>
        <p className="text-gray-600">
          Sign up as {role === "USER" ? "Customer" : "Barber"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            className={`input-field ${errors.name ? "input-error" : ""}`}
            placeholder="Enter your full name"
            disabled={isDisabled}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {role === "USER" ? (
          // USER: Phone number only
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[6-9][0-9]{9}$/,
                  message: "Enter a valid 10-digit Indian phone number",
                },
              })}
              className={`input-field ${
                errors.phoneNumber ? "input-error" : ""
              }`}
              placeholder="Enter 10-digit phone number (e.g., 9876543210)"
              disabled={isDisabled}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              No password needed! We'll send you a verification code later.
            </p>
          </div>
        ) : (
          // BARBER: Username and password
          <>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message:
                      "Username can only contain letters, numbers, and underscores",
                  },
                })}
                className={`input-field ${
                  errors.username ? "input-error" : ""
                }`}
                placeholder="Choose a username"
                disabled={isDisabled}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`input-field ${
                  errors.password ? "input-error" : ""
                }`}
                placeholder="Create a password"
                disabled={isDisabled}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className={`input-field ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
                placeholder="Confirm your password"
                disabled={isDisabled}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Location Section for Barber */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
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
                <span className="font-medium text-blue-800">Shop Location</span>
              </div>

              {isLocationLoading ? (
                <div className="flex items-center text-blue-600">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Getting your location...
                </div>
              ) : barberLocation ? (
                <div className="text-green-700">
                  ✓ Location captured successfully
                </div>
              ) : (
                <div>
                  <p className="text-blue-700 text-sm mb-2">
                    We need your shop's location to help customers find you.
                  </p>
                  {locationError && (
                    <p className="text-red-600 text-sm mb-2">{locationError}</p>
                  )}
                  <button
                    type="button"
                    onClick={requestBarberLocation}
                    className="btn-secondary text-sm"
                    disabled={isDisabled}
                  >
                    Allow Location Access
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isDisabled}
          className="btn-primary w-full flex items-center justify-center h-12"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {role === "USER" && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">
            <span className="font-medium">Simple & Fast!</span> No passwords or
            email verification needed. Just your name and phone number to get
            started.
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-primary-600 hover:text-primary-700 font-medium"
            disabled={isDisabled}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
