import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import ThemeToggle from "../components/common/ThemeToggle";

type AuthMode = "welcome" | "user-auth";
type UserAuthMode = "login" | "signup";

const HomePage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>("welcome");
  const [userAuthMode, setUserAuthMode] = useState<UserAuthMode>("login");

  // Redirect if already authenticated
  if (isAuthenticated) {
    if (role === "USER") {
      return <Navigate to="/user/dashboard" replace />;
    } else if (role === "BARBER") {
      return <Navigate to="/barber/dashboard" replace />;
    }
  }

  const handleGetStarted = () => {
    setAuthMode("user-auth");
  };

  const handleBackToWelcome = () => {
    setAuthMode("welcome");
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
        {authMode === "welcome" && (
          <div className="max-w-4xl mx-auto text-center">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-dark-800 mb-4">
                NextCut
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-dark-600 mb-8">
                Skip the wait, join the queue digitally
              </p>
              <p className="text-lg text-gray-500 dark:text-dark-500 max-w-2xl mx-auto mb-12">
                Connect with local barbers and manage your queue time
                efficiently. No more standing in line!
              </p>

              {/* Main CTA for Customers */}
              <div className="mb-12">
                <button
                  onClick={handleGetStarted}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xl px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Started as Customer
                </button>
                <p className="text-sm text-gray-500 dark:text-dark-500 mt-3">
                  Find nearby barbers and join queues instantly
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-primary-600 dark:text-primary-400"
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
                  <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800 mb-2">
                    Find Nearby
                  </h3>
                  <p className="text-gray-600 dark:text-dark-600">
                    Discover barbers in your area with real-time availability
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-primary-600 dark:text-primary-400"
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
                  <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800 mb-2">
                    Save Time
                  </h3>
                  <p className="text-gray-600 dark:text-dark-600">
                    Skip the physical queue and track your position remotely
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-primary-600 dark:text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800 mb-2">
                    Stay Updated
                  </h3>
                  <p className="text-gray-600 dark:text-dark-600">
                    Get real-time updates about your queue position
                  </p>
                </div>
              </div>
            </div>

            {/* Barber Information Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
              <div className="flex items-start justify-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-6">
                  <svg
                    className="w-8 h-8 text-blue-600 dark:text-blue-400"
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
                <div className="text-left max-w-2xl">
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                    Are you a Barber Shop Owner?
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 mb-6 text-lg">
                    Join NextCut to digitize your queue management and provide a
                    better experience for your customers.
                  </p>

                  <div className="bg-white dark:bg-dark-100 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-3">
                      📧 How to Register Your Barber Shop:
                    </h4>
                    <ol className="text-blue-700 dark:text-blue-300 space-y-2 text-left">
                      <li className="flex">
                        <span className="font-bold mr-2">1.</span>
                        <span>
                          Email us at{" "}
                          <a
                            href="mailto:barbers@nextcut.app"
                            className="font-bold underline hover:text-blue-800"
                          >
                            barbers@nextcut.app
                          </a>
                        </span>
                      </li>
                      <li className="flex">
                        <span className="font-bold mr-2">2.</span>
                        <span>
                          Include your shop name, address, and business license
                        </span>
                      </li>
                      <li className="flex">
                        <span className="font-bold mr-2">3.</span>
                        <span>
                          We'll verify your information and send you a
                          registration link
                        </span>
                      </li>
                      <li className="flex">
                        <span className="font-bold mr-2">4.</span>
                        <span>
                          Complete setup and start managing your digital queue!
                        </span>
                      </li>
                    </ol>

                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-700">
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        <strong>Why verify?</strong> We manually verify all
                        barber shops to ensure authentic businesses and maintain
                        platform quality for our customers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {authMode === "user-auth" && (
          <div className="max-w-md mx-auto">
            <div className="mb-6 text-center">
              <button
                onClick={handleBackToWelcome}
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
                Back to home
              </button>
            </div>

            {userAuthMode === "login" ? (
              <LoginForm role="USER" onSwitchToSignup={handleSwitchToSignup} />
            ) : (
              <SignupForm role="USER" onSwitchToLogin={handleSwitchToLogin} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
