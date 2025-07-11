import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "../components/auth/SignupForm";
import LoginForm from "../components/auth/LoginForm";

const HiddenBarberSignup: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            NextCut Barber
          </h1>
          <p className="text-gray-600">🔒 Private Registration Portal</p>
        </div>

        {/* Warning Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">
                Restricted Access
              </h3>
              <p className="text-sm text-yellow-700">
                This registration page is only for verified barber shop owners.
                Unauthorized registrations will be removed.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-800 mb-2">📧 Need Access?</h3>
          <p className="text-sm text-blue-700 mb-3">
            To register as a barber, please email us with:
          </p>
          <ul className="text-sm text-blue-700 space-y-1 ml-4">
            <li>• Shop name and address</li>
            <li>• Business license photo</li>
            <li>• Your contact information</li>
          </ul>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-sm font-medium text-blue-800">
              Email:{" "}
              <a href="mailto:barbers@nextcut.app" className="underline">
                barbers@nextcut.app
              </a>
            </p>
          </div>
        </div>

        {/* Auth Forms */}
        {isLogin ? (
          <LoginForm role="BARBER" onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm role="BARBER" onSwitchToLogin={() => setIsLogin(true)} />
        )}

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            ← Back to Homepage
          </button>
        </div>

        {/* Footer Warning */}
        <div className="mt-8 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-700 text-center">
            ⚠️ Only use this page if you received the direct link from NextCut
            team. Fake registrations are monitored and will be reported.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HiddenBarberSignup;
