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
  confirmPassword: string;
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
        email: data.email,
        password: data.password,
      };

      // Add barber-specific fields
      if (role === "BARBER") {
        signupData.username = data.username;
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

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className={`input-field ${errors.email ? "input-error" : ""}`}
            placeholder="Enter your email"
            disabled={isDisabled}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {role === "BARBER" && (
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

            {/* Location Section for Barber */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5"
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
                  <h4 className="font-medium text-blue-900 mb-1">
                    Shop Location
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Please ensure you're at your barbershop location before
                    registering. We'll automatically detect your location.
                  </p>

                  {isLocationLoading && (
                    <div className="flex items-center text-sm text-blue-700">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Getting your location...
                    </div>
                  )}

                  {locationError && (
                    <div className="space-y-2">
                      <p className="text-sm text-red-600">{locationError}</p>
                      <button
                        type="button"
                        onClick={requestBarberLocation}
                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {barberLocation && (
                    <div className="text-sm text-green-700">
                      ✓ Location detected: {barberLocation.lat.toFixed(6)},{" "}
                      {barberLocation.long.toFixed(6)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden fields for coordinates */}
            <input type="hidden" {...register("lat")} />
            <input type="hidden" {...register("long")} />
          </>
        )}

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
            className={`input-field ${errors.password ? "input-error" : ""}`}
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
