import api from "./api";

// src/services/location.ts
export interface LocationCoords {
  lat: number;
  long: number;
}

export interface LocationError {
  message: string;
  code?: number;
}

export class LocationService {
  private static instance: LocationService;

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async getCurrentLocation(): Promise<LocationCoords> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          message: "Geolocation is not supported by this browser",
          code: 0,
        } as LocationError);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = "Unable to get your location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please enable location permission.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }

          reject({
            message: errorMessage,
            code: error.code,
          } as LocationError);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  async watchPosition(
    callback: (coords: LocationCoords) => void,
    errorCallback?: (error: LocationError) => void
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          callback({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          if (errorCallback) {
            let errorMessage = "Unable to track your location";

            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "Location access denied.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable.";
                break;
              case error.TIMEOUT:
                errorMessage = "Location request timed out.";
                break;
            }

            errorCallback(new Error(errorMessage));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // 1 minute
        }
      );

      resolve(watchId);
    });
  }

  clearWatch(watchId: number): void {
    navigator.geolocation.clearWatch(watchId);
  }

  isSupported(): boolean {
    return !!navigator.geolocation;
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  async getNearbyBarbers(lat: number, long: number, radius: number = 10) {
    try {
      console.log("📡 Fetching nearby barbers via ApiService...");

      const response = await api.post<{
        msg?: string;
        barbers: any[];
      }>("/user/barbers", {
        lat,
        long,
        radius,
      });

      console.log("✅ Nearby barbers fetched:", response.data);

      return response.data.barbers || [];
    } catch (error: any) {
      console.error("❌ Error fetching nearby barbers:", error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.msg ||
        error.message ||
        "Failed to fetch nearby barbers";

      throw new Error(errorMessage);
    }
  }
}
// Export singleton instance
export const locationService = LocationService.getInstance();
