// Queue notification utilities for browser notifications

export type NotificationType = "next" | "update" | "joined" | "removed";

export const queueNotifications = {
  // Check if browser supports notifications
  isSupported(): boolean {
    return "Notification" in window;
  },

  // Check current permission status
  isPermissionGranted(): boolean {
    return this.isSupported() && Notification.permission === "granted";
  },

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      return "denied";
    }

    if (Notification.permission === "granted") {
      return "granted";
    }

    if (Notification.permission === "denied") {
      return "denied";
    }

    // Request permission
    const permission = await Notification.requestPermission();
    return permission;
  },

  // Show notification
  show(title: string, body: string, type: NotificationType = "update"): void {
    if (!this.isPermissionGranted()) {
      return;
    }

    const options: NotificationOptions = {
      body,
      icon: "/favicon.ico", // You can add a proper icon path
      badge: "/favicon.ico",
      tag: `queue-${type}`, // Prevents duplicate notifications
      requireInteraction: type === "next", // Keep "next in line" notification visible
      silent: false,
    };

    // Customize notification based on type
    switch (type) {
      case "next":
        options.icon = "🎉";
        options.requireInteraction = true;
        break;
      case "update":
        options.icon = "📈";
        break;
      case "joined":
        options.icon = "✅";
        break;
      case "removed":
        options.icon = "❌";
        break;
    }

    try {
      const notification = new Notification(title, options);

      // Auto-close notification after 5 seconds (except for "next" type)
      if (type !== "next") {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      // Handle notification click
      notification.onclick = () => {
        window.focus(); // Focus the NextCut tab/window
        notification.close();
      };
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  },

  // Show position update notification
  showPositionUpdate(
    currentPosition: number,
    barberName: string,
    moved: number
  ): void {
    if (currentPosition === 1) {
      this.show("You're Next! 🎉", `${barberName} will see you soon.`, "next");
    } else {
      this.show(
        "Queue Update 📈",
        `You moved up ${moved} position${
          moved > 1 ? "s" : ""
        }! Now #${currentPosition} in ${barberName}'s queue.`,
        "update"
      );
    }
  },

  // Show joined queue notification
  showJoinedQueue(barberName: string, position: number): void {
    this.show(
      "Joined Queue ✅",
      `You're #${position} in ${barberName}'s queue.`,
      "joined"
    );
  },

  // Show removed from queue notification
  showRemovedFromQueue(barberName: string): void {
    this.show(
      "Your Turn! 🎉",
      `${barberName} is ready to serve you!`,
      "removed"
    );
  },
};
