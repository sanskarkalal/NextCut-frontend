// Service Worker for NextCut - Mobile Push Notifications
// Save this file as: public/sw.js

const CACHE_NAME = "nextcut-v1";

// Install event - cache essential files
self.addEventListener("install", (event) => {
  console.log("NextCut Service Worker installed");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("NextCut Service Worker activated");
  event.waitUntil(self.clients.claim());
});

// Handle push notifications
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  // Default notification data
  let notificationData = {
    title: "NextCut Update",
    body: "Your queue position has changed",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: "queue-update",
    requireInteraction: false,
    data: {
      type: "update",
    },
  };

  // If push event has data, use it
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (error) {
      console.error("Error parsing push data:", error);
    }
  }

  // Customize notification based on type
  if (notificationData.data?.type === "next") {
    notificationData.requireInteraction = true;
    notificationData.tag = "queue-next";
    notificationData.vibrate = [200, 100, 200, 100, 200]; // Vibration pattern
  }

  const promiseChain = self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      vibrate: notificationData.vibrate || [200, 100, 200],
      data: notificationData.data,
      actions:
        notificationData.data?.type === "next"
          ? [
              {
                action: "view",
                title: "Open NextCut",
                icon: "/favicon.ico",
              },
            ]
          : [],
    }
  );

  event.waitUntil(promiseChain);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  // Focus or open the NextCut app
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // Check if NextCut is already open
        for (const client of clients) {
          if (client.url.includes(self.location.origin)) {
            return client.focus();
          }
        }

        // Open new NextCut tab/window
        return self.clients.openWindow("/");
      })
  );
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed:", event);
});

// Background sync for offline support (future enhancement)
self.addEventListener("sync", (event) => {
  if (event.tag === "queue-sync") {
    console.log("Background sync triggered for queue updates");
    // Could implement offline queue updates here
  }
});

// Message handling from main app
self.addEventListener("message", (event) => {
  console.log("Service worker received message:", event.data);

  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    const { title, body, type } = event.data;

    self.registration.showNotification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: `queue-${type}`,
      requireInteraction: type === "next",
      vibrate: type === "next" ? [200, 100, 200, 100, 200] : [200, 100, 200],
      data: { type },
    });
  }
});
