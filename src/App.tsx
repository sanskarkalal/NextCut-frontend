import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/HomePage";
import UserDashboard from "./pages/UserDashboard";
import BarberDashboard from "./pages/BarberDashboard";
import HiddenBarberSignup from "./pages/HiddenBarberSignup";
import { autoInitServiceWorker } from "./utils/serviceWorkerInit";

// Add this line at the top level of your app initialization
autoInitServiceWorker();

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />

              {/* Hidden Barber Registration Route */}
              <Route
                path="/barber/register/secret-signup-2024"
                element={<HiddenBarberSignup />}
              />

              {/* Protected User Routes */}
              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRoute requiredRole="USER">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Barber Routes */}
              <Route
                path="/barber/dashboard"
                element={
                  <ProtectedRoute requiredRole="BARBER">
                    <BarberDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className:
                  "dark:bg-dark-100 dark:text-dark-800 dark:border-dark-200",
                style: {
                  background: "var(--toast-bg, #fff)",
                  color: "var(--toast-color, #374151)",
                  border: "1px solid var(--toast-border, #e5e7eb)",
                  borderRadius: "0.5rem",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                },
                success: {
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Simple 404 Page Component
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a
        href="/"
        className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
      >
        Go Home
      </a>
    </div>
  </div>
);

export default App;
