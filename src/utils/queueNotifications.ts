// Create this as src/utils/queueNotifications.ts

import toast from "react-hot-toast";

export interface QueueNotificationConfig {
  showBrowserNotifications?: boolean;
  soundEnabled?: boolean;
}

export class QueueNotificationManager {
  private config: QueueNotificationConfig;
  private hasPermission: boolean = false;

  constructor(config: QueueNotificationConfig = {}) {
    this.config = {
      showBrowserNotifications: true,
      soundEnabled: true,
      ...config,
    };
    this.requestNotificationPermission();
  }

  private async requestNotificationPermission() {
    if ("Notification" in window && this.config.showBrowserNotifications) {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === "granted";
    }
  }

  private playNotificationSound() {
    if (!this.config.soundEnabled) return;

    try {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn("Could not play notification sound:", error);
    }
  }

  private showBrowserNotification(title: string, body: string, icon?: string) {
    if (!this.hasPermission || !this.config.showBrowserNotifications) return;

    try {
      const notification = new Notification(title, {
        body,
        icon: icon || "/favicon.ico",
        badge: "/favicon.ico",
        tag: "queue-position",
        requireInteraction: false,
        silent: false,
      });

      // Auto-close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    } catch (error) {
      console.warn("Could not show browser notification:", error);
    }
  }

  // Notify when user's position improves
  notifyPositionImproved(newPosition: number, barberName: string) {
    if (newPosition === 1) {
      // User is next
      const message = `🎉 You're next at ${barberName}! Get ready!`;

      toast.success(message, {
        duration: 6000,
        icon: "🚨",
        style: {
          background: "#10B981",
          color: "white",
          fontWeight: "bold",
        },
      });

      this.showBrowserNotification(
        "You're Next!",
        `Your turn at ${barberName} is coming up. Get ready!`,
        "🚨"
      );

      this.playNotificationSound();
    } else {
      // Position improved but not yet next
      const message = `📈 You moved up to position #${newPosition} at ${barberName}`;

      toast.success(message, {
        duration: 4000,
        icon: "📈",
      });

      this.showBrowserNotification(
        "Queue Position Updated",
        `You're now #${newPosition} in line at ${barberName}`,
        "📈"
      );
    }
  }

  // Notify about general position updates
  notifyPositionUpdate(position: number, barberName: string) {
    const message = `📍 Position update: #${position} at ${barberName}`;

    toast(message, {
      icon: "📍",
      duration: 3000,
    });
  }

  // Notify when successfully joined queue
  notifyJoinedQueue(position: number, barberName: string) {
    const message =
      position === 1
        ? `🎉 You're next at ${barberName}!`
        : `✅ Joined ${barberName}'s queue at position #${position}`;

    toast.success(message, {
      duration: 4000,
      icon: position === 1 ? "🎉" : "✅",
    });

    if (position === 1) {
      this.showBrowserNotification(
        "You're Next!",
        `Your turn at ${barberName} is ready!`,
        "🎉"
      );
      this.playNotificationSound();
    }
  }

  // Notify when removed from queue
  notifyRemovedFromQueue(
    barberName: string,
    reason: "left" | "served" = "left"
  ) {
    const message =
      reason === "served"
        ? `✅ Your turn at ${barberName} is ready!`
        : `👋 Left ${barberName}'s queue`;

    toast.success(message, {
      duration: 3000,
      icon: reason === "served" ? "✅" : "👋",
    });

    if (reason === "served") {
      this.showBrowserNotification(
        "Your Turn!",
        `It's your turn at ${barberName}. Head over now!`,
        "✅"
      );
      this.playNotificationSound();
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<QueueNotificationConfig>) {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.showBrowserNotifications && !this.hasPermission) {
      this.requestNotificationPermission();
    }
  }

  // Check if notifications are supported and enabled
  isSupported(): boolean {
    return "Notification" in window;
  }

  hasNotificationPermission(): boolean {
    return this.hasPermission;
  }
}

// Create a singleton instance
export const queueNotifications = new QueueNotificationManager();
