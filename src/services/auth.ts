import api from "./api";
import type { AuthResponse, SignupData, LoginData, UserRole } from "../types";

export const authService = {
  async login(data: LoginData, role: UserRole): Promise<AuthResponse> {
    const endpoint = role === "USER" ? "/user/signin" : "/barber/signin";
    const requestData =
      role === "USER"
        ? data
        : { username: data.email, password: data.password };

    const response = await api.post<AuthResponse>(endpoint, requestData);
    return response.data;
  },

  async signup(data: SignupData, role: UserRole): Promise<AuthResponse> {
    const endpoint = role === "USER" ? "/user/signup" : "/barber/signup";
    const response = await api.post<AuthResponse>(endpoint, data);
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
};
