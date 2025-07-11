// src/services/auth.ts - COMPLETE FIXED VERSION
import api from "./api";
import type { AuthResponse, SignupData, LoginData, UserRole } from "../types";

export const authService = {
  async login(
    phoneOrUsername: string,
    password?: string,
    role?: UserRole
  ): Promise<AuthResponse> {
    console.log("🚀 Auth Service Login:", {
      phoneOrUsername,
      role,
      hasPassword: !!password,
    });

    // Auto-detect role if not provided
    const detectedRole = role || (password ? "BARBER" : "USER");

    const endpoint =
      detectedRole === "USER" ? "/user/signin" : "/barber/signin";

    let requestData: any;

    if (detectedRole === "USER") {
      // User login with phone number only
      requestData = { phoneNumber: phoneOrUsername };
    } else {
      // Barber login with username and password
      requestData = { username: phoneOrUsername, password };
    }

    console.log("📤 Login Request:", {
      endpoint,
      requestData: {
        ...requestData,
        password: requestData.password ? "***" : undefined,
      },
    });

    const response = await api.post<AuthResponse>(endpoint, requestData);

    console.log("📥 Login Response:", response.data);
    return response.data;
  },

  async signup(data: SignupData, role: UserRole): Promise<AuthResponse> {
    console.log("🚀 Auth Service Signup:", {
      role,
      data: { ...data, password: data.password ? "***" : undefined },
    });

    const endpoint = role === "USER" ? "/user/signup" : "/barber/signup";

    let requestData: any;

    if (role === "USER") {
      // User signup with phone number and name only
      requestData = {
        name: data.name,
        phoneNumber: data.phoneNumber,
      };
    } else {
      // Barber signup with all fields
      requestData = {
        name: data.name,
        username: data.username,
        password: data.password,
        lat: data.lat,
        long: data.long,
      };
    }

    console.log("📤 Signup Request:", {
      endpoint,
      requestData: {
        ...requestData,
        password: requestData.password ? "***" : undefined,
      },
    });

    const response = await api.post<AuthResponse>(endpoint, requestData);

    console.log("📥 Signup Response:", response.data);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("barber");
    localStorage.removeItem("role");
  },

  getStoredAuth() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const barber = localStorage.getItem("barber");
    const role = localStorage.getItem("role") as UserRole;

    return {
      token,
      user: user ? JSON.parse(user) : null,
      barber: barber ? JSON.parse(barber) : null,
      role,
    };
  },

  setStoredAuth(token: string, user: any, barber: any, role: UserRole) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    // Clear both user and barber data first
    localStorage.removeItem("user");
    localStorage.removeItem("barber");

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    if (barber) {
      localStorage.setItem("barber", JSON.stringify(barber));
    }
  },

  // ✅ FIXED: Enhanced phone number validation
  validatePhoneNumber(phoneNumber: string): {
    isValid: boolean;
    cleaned: string;
    error?: string;
  } {
    console.log("🔍 Validating phone number:", phoneNumber);

    // Remove all non-digits
    let cleaned = phoneNumber.replace(/\D/g, "");

    // If starts with +91, remove it
    if (cleaned.startsWith("91") && cleaned.length === 12) {
      cleaned = cleaned.substring(2);
    }

    console.log("📱 Cleaned phone:", cleaned);

    // Should be exactly 10 digits
    if (cleaned.length !== 10) {
      return {
        isValid: false,
        cleaned,
        error: "Phone number must be exactly 10 digits",
      };
    }

    // Should start with 6, 7, 8, or 9
    if (!/^[6-9]/.test(cleaned)) {
      return {
        isValid: false,
        cleaned,
        error: "Phone number must start with 6, 7, 8, or 9",
      };
    }

    console.log("✅ Phone validation successful");
    return { isValid: true, cleaned };
  },
};
