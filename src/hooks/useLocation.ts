// src/hooks/useLocation.ts
import { useState, useEffect, useCallback } from "react";
import {
  locationService,
  type LocationCoords,
  type LocationError,
} from "../services/location";
import type { Barber } from "../types";
import toast from "react-hot-toast";

interface UseLocationReturn {
  location: LocationCoords | null;
  locationError: LocationError | null;
  isLoadingLocation: boolean;
  hasLocationPermission: boolean;
  nearbyBarbers: Barber[];
  isLoadingBarbers: boolean;
  barbersError: string | null;
  requestLocation: () => Promise<void>;
  refreshBarbers: () => Promise<void>;
  clearLocationError: () => void;
  forceRefreshBarbers: () => Promise<void>;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [locationError, setLocationError] = useState<LocationError | null>(
    null
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [nearbyBarbers, setNearbyBarbers] = useState<Barber[]>([]);
  const [isLoadingBarbers, setIsLoadingBarbers] = useState(false);
  const [barbersError, setBarbersError] = useState<string | null>(null);

  // Fetch nearby barbers based on current location
  const fetchNearbyBarbers = useCallback(
    async (userLocation: LocationCoords) => {
      if (!userLocation) return;

      setIsLoadingBarbers(true);
      setBarbersError(null);

      try {
        const barbersData = await locationService.getNearbyBarbers(
          userLocation.lat,
          userLocation.long
        );

        // Add distance calculations
        const barbersWithDistance = barbersData.map((barber: Barber) => ({
          ...barber,
          distanceKm: locationService.calculateDistance(
            userLocation.lat,
            userLocation.long,
            barber.lat,
            barber.long
          ),
        }));

        setNearbyBarbers(barbersWithDistance);
      } catch (error: any) {
        setBarbersError(error.message || "Failed to load nearby barbers");
        toast.error("Failed to load nearby barbers");
      } finally {
        setIsLoadingBarbers(false);
      }
    },
    []
  );

  // Request location permission and get current location
  const requestLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      const coords = await locationService.getCurrentLocation();
      setLocation(coords);
      setHasLocationPermission(true);
      toast.success("Location access granted!");

      // Automatically fetch nearby barbers
      await fetchNearbyBarbers(coords);
    } catch (error: any) {
      setLocationError(error as LocationError);
      setHasLocationPermission(false);
      toast.error(error.message || "Failed to get location");
    } finally {
      setIsLoadingLocation(false);
    }
  }, [fetchNearbyBarbers]);

  // Refresh barbers list
  const refreshBarbers = useCallback(async () => {
    if (location) {
      await fetchNearbyBarbers(location);
    }
  }, [location, fetchNearbyBarbers]);

  // Force refresh barbers (same as refreshBarbers for now)
  const forceRefreshBarbers = useCallback(async () => {
    await refreshBarbers();
  }, [refreshBarbers]);

  // Clear location error
  const clearLocationError = useCallback(() => {
    setLocationError(null);
  }, []);

  // Check for existing location on mount
  useEffect(() => {
    // You could check if location permission was previously granted
    // and automatically request location
  }, []);

  return {
    location,
    locationError,
    isLoadingLocation,
    hasLocationPermission,
    nearbyBarbers,
    isLoadingBarbers,
    barbersError,
    requestLocation,
    refreshBarbers,
    clearLocationError,
    forceRefreshBarbers,
  };
};
