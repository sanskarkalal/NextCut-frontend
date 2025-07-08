// Service Worker initialization utility
// Import this in your main App.tsx or index.tsx

export const initializeServiceWorker = async (): Promise<void> => {
  // Check if service workers are supported
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Workers not supported in this browser");
    return;
  }

  try {
    // Register the service worker
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/", // Service worker will control the entire site
    });

    console.log("Service Worker registered successfully:", registration);

    // Handle service worker updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New service worker installed, could show update notification
            console.log("New service worker available");
          }
        });
      }
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      console.log("Message from service worker:", event.data);
    });

    // Check if there's an active service worker controlling the page
    if (navigator.serviceWorker.controller) {
      console.log("Service Worker is controlling the page");
    }
  } catch (error) {
    console.error("Service Worker registration failed:", error);
  }
};

// Initialize on page load
export const autoInitServiceWorker = (): void => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeServiceWorker);
  } else {
    initializeServiceWorker();
  }
};
