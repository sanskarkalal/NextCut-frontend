// src/hooks/useLocation.ts - Corrected version
import { useState, useEffect, useCallback } from "react";
import {
  locationService,
  type LocationCoords,
  type LocationError,
} from "../services/location";
import { type Barber } from "../types";
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
  forceRefreshBarbers: () => Promise<void>; // Force refresh barber data
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
        // Use locationService.getNearbyBarbers instead of userService
        const barbersData = await locationService.getNearbyBarbers(
          userLocation.lat,
          userLocation.long
        );

        // Add distance and estimated wait time calculations
        const barbersWithDistance = barbersData.map((barber: Barber) => ({
          ...barber,
          distanceKm: locationService.calculateDistance(
            userLocation.lat,
            userLocation.long,
            barber.lat,
            barber.long
          ),
          estimatedWaitTime: (barber.queueLength || 0) * 15, // 15 minutes per person
        }));

        // Sort by distance
        barbersWithDistance.sort(
          (a: Barber, b: Barber) => (a.distanceKm || 0) - (b.distanceKm || 0)
        );

        setNearbyBarbers(barbersWithDistance);
      } catch (error: any) {
        const errorMessage = error.message || "Failed to fetch nearby barbers";
        setBarbersError(errorMessage);
        console.error("Error fetching nearby barbers:", error);
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
      const userLocation = await locationService.getCurrentLocation();
      setLocation(userLocation);
      setHasLocationPermission(true);

      // Fetch nearby barbers immediately after getting location
      await fetchNearbyBarbers(userLocation);

      toast.success("Location access granted! Finding nearby barbers...");
    } catch (error: any) {
      setLocationError(error as LocationError);
      setHasLocationPermission(false);

      // Don't show toast for user-denied permission (they chose not to share)
      if (error.code !== 1) {
        toast.error(error.message);
      }
    } finally {
      setIsLoadingLocation(false);
    }
  }, [fetchNearbyBarbers]);

  // Refresh barbers (wrapper around fetchNearbyBarbers)
  const refreshBarbers = useCallback(async () => {
    if (location) {
      await fetchNearbyBarbers(location);
    }
  }, [location, fetchNearbyBarbers]);

  // Force refresh barbers with user feedback
  const forceRefreshBarbers = useCallback(async () => {
    if (location) {
      toast.loading("Refreshing barber list...", { id: "refresh-barbers" });
      await fetchNearbyBarbers(location);
      toast.success("Barber list updated!", { id: "refresh-barbers" });
    }
  }, [location, fetchNearbyBarbers]);

  // Clear location error
  const clearLocationError = useCallback(() => {
    setLocationError(null);
  }, []);

  // Check if location is already available on mount
  useEffect(() => {
    const checkInitialLocation = async () => {
      try {
        if (navigator.geolocation) {
          // Check if we have permission without requesting
          const permission = await navigator.permissions.query({
            name: "geolocation",
          });
          if (permission.state === "granted") {
            await requestLocation();
          }
        }
      } catch (error) {
        // Silent fail - user can manually request location
        console.log("Initial location check failed:", error);
      }
    };

    checkInitialLocation();
  }, [requestLocation]);

  // Auto-refresh barber queue lengths every 30 seconds
  useEffect(() => {
    if (!location || !hasLocationPermission) return;

    const interval = setInterval(() => {
      // Silently refresh barber data (no toast notifications)
      fetchNearbyBarbers(location);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [location, hasLocationPermission, fetchNearbyBarbers]);

  // Refresh barbers when location changes
  useEffect(() => {
    if (location && hasLocationPermission) {
      fetchNearbyBarbers(location);
    }
  }, [location, hasLocationPermission, fetchNearbyBarbers]);

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
