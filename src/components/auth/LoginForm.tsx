import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types";
import LoadingSpinner from "../common/LoadingSpinner";

interface LoginFormProps {
  role: UserRole;
  onSwitchToSignup: () => void;
}

interface LoginFormData {
  phoneOrUsername: string;
  password?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ role, onSwitchToSignup }) => {
  const { login, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      await login(data.phoneOrUsername, data.password, role);
    } catch (error) {
      // Error handling is done in the context
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = loading || isSubmitting;

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">
          Sign in as {role === "USER" ? "Customer" : "Barber"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="phoneOrUsername"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {role === "USER" ? "Phone Number" : "Username"}
          </label>
          <input
            type="text"
            id="phoneOrUsername"
            {...register("phoneOrUsername", {
              required: `${
                role === "USER" ? "Phone number" : "Username"
              } is required`,
              ...(role === "USER" && {
                pattern: {
                  value: /^[6-9][0-9]{9}$/,
                  message: "Enter a valid 10-digit Indian phone number",
                },
              }),
            })}
            className={`input-field ${
              errors.phoneOrUsername ? "input-error" : ""
            }`}
            placeholder={
              role === "USER"
                ? "Enter your phone number (e.g., 9876543210)"
                : "Enter your username"
            }
            disabled={isDisabled}
          />
          {errors.phoneOrUsername && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phoneOrUsername.message}
            </p>
          )}
        </div>

        {role === "BARBER" && (
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
                required: role === "BARBER" ? "Password is required" : false,
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`input-field ${errors.password ? "input-error" : ""}`}
              placeholder="Enter your password"
              disabled={isDisabled}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isDisabled}
          className="btn-primary w-full flex items-center justify-center h-12"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {role === "USER" && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <span className="font-medium">New to NextCut?</span> Just enter your
            phone number above - no password needed!
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        {role === "USER" ? (
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToSignup}
              className="text-primary-600 hover:text-primary-700 font-medium"
              disabled={isDisabled}
            >
              Sign Up
            </button>
          </p>
        ) : (
          <p className="text-gray-600 text-sm">
            Need to register your barber shop?{" "}
            <a
              href="mailto:nextcut.barber.register@gmail.com"
              className="text-primary-600 hover:text-primary-700 font-medium underline"
            >
              Email us for registration
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
