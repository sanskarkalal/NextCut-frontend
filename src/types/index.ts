export interface User {
  id: number;
  name: string;
  email: string;
  inQueue?: boolean;
  queuedBarberId?: number;
}

export interface Barber {
  id: number;
  name: string;
  username: string;
  lat: number;
  long: number;
  distanceKm?: number;
  queueLength?: number; // ADD THIS - number of people in queue
  estimatedWaitTime?: number; // ADD THIS - in minutes
}

export interface QueueEntry {
  id: number;
  enteredAt: string;
  barberId: number;
  userId: number;
  user: {
    id: number;
    name: string;
  };
}

export interface AuthResponse {
  user?: User;
  barber?: Barber;
  token: string;
  msg: string;
}

export interface ApiError {
  error?: string;
  msg?: string;
}

export type UserRole = "USER" | "BARBER";

export interface AuthContextType {
  user: User | null;
  barber: Barber | null;
  token: string | null;
  role: UserRole | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (data: SignupData, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  username?: string; // for barber
  lat?: number; // for barber
  long?: number; // for barber
}

export interface LoginData {
  email: string;
  password: string;
}
