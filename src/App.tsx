
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/HomePage";
import UserDashboard from "./pages/UserDashboard";
import BarberDashboard from "./pages/BarberDashboard";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />

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

export default App;
