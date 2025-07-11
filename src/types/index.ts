// src/types/index.ts
export interface User {
  id: number;
  name: string;
  phoneNumber: string; // Changed from email to phoneNumber
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
  queueLength?: number;
  estimatedWaitTime?: number; // in minutes
}

export interface QueueEntry {
  id: number;
  enteredAt: string;
  barberId: number;
  userId: number;
  service: string; // NEW: service type
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

export type ServiceType = "haircut" | "beard" | "haircut+beard";

export interface AuthContextType {
  user: User | null;
  barber: Barber | null;
  token: string | null;
  role: UserRole | null;
  login: (
    phoneOrUsername: string,
    password?: string,
    role?: UserRole
  ) => Promise<void>; // Updated for phone auth
  signup: (data: SignupData, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface SignupData {
  name: string;
  phoneNumber?: string; // For users - phone number
  email?: string; // Keep for backward compatibility
  password?: string; // Only for barbers now
  username?: string; // for barber
  lat?: number; // for barber
  long?: number; // for barber
}

export interface LoginData {
  phoneNumber?: string; // For users
  email?: string; // Keep for backward compatibility
  username?: string; // For barbers
  password?: string; // Only for barbers
}

// NEW: Service selection interface
export interface ServiceOption {
  id: ServiceType;
  name: string;
  duration: number; // in minutes
  description: string;
}

// NEW: Queue status with service info
export interface QueueStatus {
  inQueue: boolean;
  queuePosition: number | null;
  barber: {
    id: number;
    name: string;
    lat?: number; // Made optional to match API
    long?: number; // Made optional to match API
  } | null;
  enteredAt: string | null;
  service: ServiceType | null;
  estimatedWaitTime: number | null; // in minutes
}
