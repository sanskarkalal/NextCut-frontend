// src/utils/directionUtil.ts
export const directionsUtils = {
  // Open Google Maps with directions
  openGoogleMaps(lat: number, lng: number, name?: string) {
    const destination = name ? encodeURIComponent(name) : `${lat},${lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, "_blank");
  },

  // Open Apple Maps (for Safari/iOS)
  openAppleMaps(lat: number, lng: number, name?: string) {
    const destination = name ? encodeURIComponent(name) : `${lat},${lng}`;
    const url = `http://maps.apple.com/?daddr=${destination}`;
    window.open(url, "_blank");
  },

  // Auto-detect best maps app
  openDirections(lat: number, lng: number, name?: string) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS || isSafari) {
      this.openAppleMaps(lat, lng, name);
    } else {
      this.openGoogleMaps(lat, lng, name);
    }
  },

  // Get directions URL without opening
  getDirectionsUrl(lat: number, lng: number, name?: string): string {
    const destination = name ? encodeURIComponent(name) : `${lat},${lng}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  },
};
