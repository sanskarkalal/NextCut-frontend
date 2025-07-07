import api from "./api";
import type { Barber } from "../types";

export interface LocationCoords {
  lat: number;
  long: number;
}

export interface LocationError {
  code: number;
  message: string;
}

export const locationService = {
  // Get user's current location using browser geolocation
  getCurrentLocation(): Promise<LocationCoords> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: 0,
          message: "Geolocation is not supported by this browser",
        });
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          let message = "Unable to retrieve location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "Location access denied by user";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information is unavailable";
              break;
            case error.TIMEOUT:
              message = "Location request timed out";
              break;
          }

          reject({
            code: error.code,
            message,
          });
        },
        options
      );
    });
  },

  // Get nearby barbers from API
  async getNearbyBarbers(
    lat: number,
    long: number,
    radius: number = 5
  ): Promise<Barber[]> {
    try {
      const response = await api.get(
        `/user/nearby?lat=${lat}&long=${long}&radius=${radius}`
      );
      return response.data.barbers || [];
    } catch (error: any) {
      console.error("Error fetching nearby barbers:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch nearby barbers"
      );
    }
  },

  // Calculate distance between two points (for display purposes)
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  // Convert degrees to radians
  toRad(deg: number): number {
    return deg * (Math.PI / 180);
  },

  // Format distance for display
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
  },
};
