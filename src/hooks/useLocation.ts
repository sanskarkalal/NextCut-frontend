import { useState, useEffect, useCallback } from "react";
import {
  locationService,
  type LocationCoords,
  type LocationError,
} from "../services/location";
import type { Barber } from "../types";
import toast from "react-hot-toast";

interface UseLocationReturn {
  // Location state
  location: LocationCoords | null;
  locationError: LocationError | null;
  isLoadingLocation: boolean;
  hasLocationPermission: boolean;

  // Barbers state
  nearbyBarbers: Barber[];
  isLoadingBarbers: boolean;
  barbersError: string | null;

  // Actions
  requestLocation: () => void;
  refreshBarbers: () => void;
  clearLocationError: () => void;
}

export const useLocation = (): UseLocationReturn => {
  // Location state
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [locationError, setLocationError] = useState<LocationError | null>(
    null
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  // Barbers state
  const [nearbyBarbers, setNearbyBarbers] = useState<Barber[]>([]);
  const [isLoadingBarbers, setIsLoadingBarbers] = useState(false);
  const [barbersError, setBarbersError] = useState<string | null>(null);

  // Request user's location
  const requestLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      const coords = await locationService.getCurrentLocation();
      setLocation(coords);
      setHasLocationPermission(true);

      // Store location in localStorage for future use
      localStorage.setItem("userLocation", JSON.stringify(coords));

      toast.success("Location access granted");
    } catch (error: any) {
      setLocationError(error);
      setHasLocationPermission(false);

      // Don't show toast for user-denied permission (they chose not to share)
      if (error.code !== 1) {
        toast.error(error.message);
      }
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  // Fetch nearby barbers
  const fetchNearbyBarbers = useCallback(async (coords: LocationCoords) => {
    setIsLoadingBarbers(true);
    setBarbersError(null);

    try {
      const barbers = await locationService.getNearbyBarbers(
        coords.lat,
        coords.long
      );
      setNearbyBarbers(barbers);

      if (barbers.length === 0) {
        toast("No barbers found nearby", {
          icon: "📍",
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch nearby barbers";
      setBarbersError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoadingBarbers(false);
    }
  }, []);

  // Refresh barbers (manual refresh)
  const refreshBarbers = useCallback(() => {
    if (location) {
      fetchNearbyBarbers(location);
    }
  }, [location, fetchNearbyBarbers]);

  // Clear location error
  const clearLocationError = useCallback(() => {
    setLocationError(null);
  }, []);

  // Initialize from localStorage and fetch barbers when location changes
  useEffect(() => {
    // Try to load saved location
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        const coords = JSON.parse(savedLocation);
        setLocation(coords);
        setHasLocationPermission(true);
      } catch (error) {
        // Invalid saved location, remove it
        localStorage.removeItem("userLocation");
      }
    }
  }, []);

  // Fetch barbers when location is available
  useEffect(() => {
    if (location) {
      fetchNearbyBarbers(location);
    }
  }, [location, fetchNearbyBarbers]);

  return {
    // Location state
    location,
    locationError,
    isLoadingLocation,
    hasLocationPermission,

    // Barbers state
    nearbyBarbers,
    isLoadingBarbers,
    barbersError,

    // Actions
    requestLocation,
    refreshBarbers,
    clearLocationError,
  };
};
