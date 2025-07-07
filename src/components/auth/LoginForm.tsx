import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import type { LoginData, UserRole } from "../../types";
import LoadingSpinner from "../common/LoadingSpinner";

interface LoginFormProps {
  role: UserRole;
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ role, onSwitchToSignup }) => {
  const { login, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password, role);
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
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {role === "USER" ? "Email" : "Username"}
          </label>
          <input
            type={role === "USER" ? "email" : "text"}
            id="email"
            {...register("email", {
              required: `${role === "USER" ? "Email" : "Username"} is required`,
              ...(role === "USER" && {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }),
            })}
            className={`input-field ${errors.email ? "input-error" : ""}`}
            placeholder={`Enter your ${role === "USER" ? "email" : "username"}`}
            disabled={isDisabled}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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

      <div className="mt-6 text-center">
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
      </div>
    </div>
  );
};

export default LoginForm;
