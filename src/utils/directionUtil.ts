// Directions utility for opening maps with coordinates

export interface Location {
  lat: number;
  long: number;
  name?: string;
}

export const directionsUtils = {
  // Detect user's platform
  getPlatform(): "ios" | "android" | "desktop" {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent)) {
      return "ios";
    } else if (/android/.test(userAgent)) {
      return "android";
    } else {
      return "desktop";
    }
  },

  // Generate Google Maps URL (universal - works on all platforms)
  getGoogleMapsUrl(destination: Location): string {
    const { lat, long, name } = destination;

    // Basic Google Maps directions URL
    let url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`;

    // Add destination name if available
    if (name) {
      url += `&destination_place_id=${encodeURIComponent(name)}`;
    }

    // Add navigation mode
    url += "&travelmode=driving";

    return url;
  },

  // Generate Apple Maps URL (iOS specific)
  getAppleMapsUrl(destination: Location): string {
    const { lat, long, name } = destination;

    // Apple Maps URL scheme
    let url = `https://maps.apple.com/?daddr=${lat},${long}`;

    if (name) {
      url += `&q=${encodeURIComponent(name)}`;
    }

    url += "&dirflg=d"; // Driving directions

    return url;
  },

  // Get the best maps URL for the current platform
  getBestMapsUrl(destination: Location): string {
    const platform = this.getPlatform();

    // Always use Google Maps as it's universal and reliable
    // iOS users will get option to open in Apple Maps
    return this.getGoogleMapsUrl(destination);
  },

  // Open directions in the best available maps app
  openDirections(destination: Location): void {
    const url = this.getBestMapsUrl(destination);

    try {
      // Open in new tab/window
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening directions:", error);
      // Fallback: try to navigate in same window
      window.location.href = url;
    }
  },

  // Get directions button text based on platform
  getDirectionsButtonText(): string {
    const platform = this.getPlatform();

    switch (platform) {
      case "ios":
        return "Get Directions (Maps)";
      case "android":
        return "Get Directions (Google Maps)";
      default:
        return "Get Directions";
    }
  },

  // Check if coordinates are valid
  isValidLocation(location: Location | null | undefined): boolean {
    if (!location) return false;

    const { lat, long } = location;

    // Check if coordinates are valid numbers and within Earth's bounds
    return (
      typeof lat === "number" &&
      typeof long === "number" &&
      lat >= -90 &&
      lat <= 90 &&
      long >= -180 &&
      long <= 180 &&
      !isNaN(lat) &&
      !isNaN(long)
    );
  },

  // Calculate distance between two points (optional utility)
  calculateDistance(point1: Location, point2: Location): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLong = this.toRadians(point2.long - point1.long);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.lat)) *
        Math.cos(this.toRadians(point2.lat)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  },

  // Convert degrees to radians
  toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  },

  // Format distance for display
  formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    } else {
      return `${distance}km away`;
    }
  },
};
