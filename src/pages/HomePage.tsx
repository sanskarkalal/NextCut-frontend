import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import ThemeToggle from "../components/common/ThemeToggle";

type AuthMode = "role-selection" | "user-auth" | "barber-auth";
type UserAuthMode = "login" | "signup";

const HomePage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>("role-selection");
  const [userAuthMode, setUserAuthMode] = useState<UserAuthMode>("login");

  // Redirect if already authenticated
  if (isAuthenticated) {
    if (role === "USER") {
      return <Navigate to="/user/dashboard" replace />;
    } else if (role === "BARBER") {
      return <Navigate to="/barber/dashboard" replace />;
    }
  }

  const handleRoleSelection = (selectedRole: UserRole) => {
    if (selectedRole === "USER") {
      setAuthMode("user-auth");
    } else {
      setAuthMode("barber-auth");
    }
  };

  const handleBackToRoleSelection = () => {
    setAuthMode("role-selection");
  };

  const handleSwitchToSignup = () => {
    setUserAuthMode("signup");
  };

  const handleSwitchToLogin = () => {
    setUserAuthMode("login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-100 dark:to-dark-200">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-8">
        {authMode === "role-selection" && (
          <div className="max-w-4xl mx-auto text-center">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-dark-800 mb-4">
                NextCut
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-dark-600 mb-8">
                Skip the wait, join the queue digitally
              </p>
              <p className="text-lg text-gray-500 dark:text-dark-500 max-w-2xl mx-auto">
                Connect with local barbers and manage your queue time
                efficiently. No more standing in line!
              </p>
            </div>

            {/* Role Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-12">
              {/* Customer Card */}
              <div
                onClick={() => handleRoleSelection("USER")}
                className="card card-hover cursor-pointer group transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
                    <svg
                      className="w-10 h-10 text-primary-600 dark:text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-3">
                    I'm a Customer
                  </h3>
                  <p className="text-gray-600 dark:text-dark-600 mb-6">
                    Find nearby barbers and join their queue remotely
                  </p>
                  <ul className="text-sm text-gray-500 dark:text-dark-500 space-y-2 text-left">
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 text-green-500 dark:text-green-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Find barbers near you
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 text-green-500 dark:text-green-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Join queue remotely
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 text-green-500 dark:text-green-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Track your position
                    </li>
                  </ul>
                </div>
              </div>

              {/* Barber Card */}
              <div
                onClick={() => handleRoleSelection("BARBER")}
                className="card card-hover cursor-pointer group transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                    <svg
                      className="w-10 h-10 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-3">
                    I'm a Barber
                  </h3>
                  <p className="text-gray-600 dark:text-dark-600 mb-6">
                    Sign in to manage your digital queue
                  </p>
                  <ul className="text-sm text-gray-500 dark:text-dark-500 space-y-2 text-left">
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Manage your queue
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Serve customers efficiently
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Real-time updates
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Barber Registration Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="text-center">
                <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3">
                  🔒 New Barber Shop? Registration Required
                </h4>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  To maintain platform quality, new barber shops must be
                  manually verified.
                </p>
                <div className="bg-white dark:bg-dark-100 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                  <p className="text-blue-800 dark:text-blue-200 text-sm mb-2">
                    <strong>To register your barber shop:</strong>
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Email{" "}
                    <a
                      href="mailto:nextcut.barber.register@gmail.com"
                      className="font-bold underline hover:text-blue-800"
                    >
                      nextcut.barber.register@gmail.com
                    </a>{" "}
                    with your shop details and business license. We'll verify
                    and send you a registration link.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {authMode === "user-auth" && (
          <div className="max-w-md mx-auto">
            <div className="mb-6 text-center">
              <button
                onClick={handleBackToRoleSelection}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to role selection
              </button>
            </div>

            {userAuthMode === "login" ? (
              <LoginForm role="USER" onSwitchToSignup={handleSwitchToSignup} />
            ) : (
              <SignupForm role="USER" onSwitchToLogin={handleSwitchToLogin} />
            )}
          </div>
        )}

        {authMode === "barber-auth" && (
          <div className="max-w-md mx-auto">
            <div className="mb-6 text-center">
              <button
                onClick={handleBackToRoleSelection}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to role selection
              </button>
            </div>

            {/* Barber Sign In Only - No Signup Option */}
            <LoginForm
              role="BARBER"
              onSwitchToSignup={() => {}} // Empty function - no signup switching
            />

            {/* Info about registration */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Need to register your barber shop?
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                New barber shops require manual verification for platform
                security.
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                📧 Email us at{" "}
                <a
                  href="mailto:nextcut.barber.register@gmail.com"
                  className="font-bold underline hover:text-blue-800 dark:hover:text-blue-200"
                >
                  nextcut.barber.register@gmail.com
                </a>{" "}
                with your shop details to get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
