/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { AuthContextType, User, Barber, UserRole, SignupData } from "../types";
import { authService } from "../services/auth";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedAuth = authService.getStoredAuth();

        if (storedAuth.token && storedAuth.role) {
          setToken(storedAuth.token);
          setRole(storedAuth.role);

          if (storedAuth.role === "USER" && storedAuth.user) {
            setUser(storedAuth.user);
          } else if (storedAuth.role === "BARBER" && storedAuth.barber) {
            setBarber(storedAuth.barber);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear corrupted data
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, userRole: UserRole) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password }, userRole);

      if (response.token) {
        setToken(response.token);
        setRole(userRole);

        if (userRole === "USER" && response.user) {
          setUser(response.user);
          setBarber(null); // Clear barber data
          authService.setStoredAuth(
            response.token,
            response.user,
            null,
            userRole
          );
        } else if (userRole === "BARBER" && response.barber) {
          setBarber(response.barber);
          setUser(null); // Clear user data
          authService.setStoredAuth(
            response.token,
            null,
            response.barber,
            userRole
          );
        } else {
          // Invalid response structure
          throw new Error("Invalid login response");
        }

        toast.success(response.msg || "Login successful!");
      } else {
        throw new Error(response.msg || "Login failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.msg ||
        error.response?.data?.error ||
        error.message ||
        "Login failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupData, userRole: UserRole) => {
    try {
      setLoading(true);
      const response = await authService.signup(data, userRole);

      if (response.token) {
        setToken(response.token);
        setRole(userRole);

        if (userRole === "USER" && response.user) {
          setUser(response.user);
          setBarber(null); // Clear barber data
          authService.setStoredAuth(
            response.token,
            response.user,
            null,
            userRole
          );
        } else if (userRole === "BARBER" && response.barber) {
          setBarber(response.barber);
          setUser(null); // Clear user data
          authService.setStoredAuth(
            response.token,
            null,
            response.barber,
            userRole
          );
        } else {
          // Invalid response structure
          throw new Error("Invalid signup response");
        }

        toast.success(response.msg || "Account created successfully!");
      } else {
        throw new Error(response.msg || "Signup failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.msg ||
        error.response?.data?.error ||
        error.message ||
        "Signup failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setBarber(null);
    setToken(null);
    setRole(null);
    authService.logout();
    toast.success("Logged out successfully");
  };

  const isAuthenticated = !!(token && (user || barber));

  const value: AuthContextType = {
    user,
    barber,
    token,
    role,
    login,
    signup,
    logout,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
