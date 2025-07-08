// Queue notification utilities for browser notifications

export type NotificationType = "next" | "update" | "joined" | "removed";

export const queueNotifications = {
  // Audio context for playing notification sounds
  audioContext: null as AudioContext | null,

  // Service worker registration
  serviceWorkerRegistration: null as ServiceWorkerRegistration | null,

  // Initialize notifications and service worker
  async init(): Promise<void> {
    // Register service worker for mobile notifications
    if ("serviceWorker" in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register(
          "/sw.js"
        );
        console.log("Service Worker registered successfully");
      } catch (error) {
        console.warn("Service Worker registration failed:", error);
      }
    }

    this.initAudio();
  },

  // Initialize audio context
  initAudio(): void {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn("Audio context not supported:", error);
      }
    }
  },

  // Play notification sound
  playSound(type: NotificationType = "update"): void {
    this.initAudio();

    if (!this.audioContext) return;

    try {
      // Create oscillator for beep sound
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Different sounds for different notification types
      switch (type) {
        case "next":
          // Triple beep for "next in line" - more attention-grabbing
          this.playTripleBeep();
          return;
        case "update":
          oscillator.frequency.setValueAtTime(
            800,
            this.audioContext.currentTime
          );
          break;
        case "joined":
          oscillator.frequency.setValueAtTime(
            600,
            this.audioContext.currentTime
          );
          break;
        case "removed":
          oscillator.frequency.setValueAtTime(
            1000,
            this.audioContext.currentTime
          );
          break;
      }

      // Set gain (volume)
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.3
      );

      // Play sound
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn("Error playing notification sound:", error);
    }
  },

  // Play triple beep for "next in line"
  playTripleBeep(): void {
    if (!this.audioContext) return;

    const playBeep = (delay: number, frequency: number = 1000) => {
      try {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        oscillator.frequency.setValueAtTime(
          frequency,
          this.audioContext!.currentTime + delay
        );
        gainNode.gain.setValueAtTime(
          0.15,
          this.audioContext!.currentTime + delay
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext!.currentTime + delay + 0.2
        );

        oscillator.start(this.audioContext!.currentTime + delay);
        oscillator.stop(this.audioContext!.currentTime + delay + 0.2);
      } catch (error) {
        console.warn("Error playing beep:", error);
      }
    };

    // Play three ascending beeps
    playBeep(0, 800); // First beep
    playBeep(0.3, 1000); // Second beep (higher)
    playBeep(0.6, 1200); // Third beep (highest)
  },

  // Check if browser supports notifications
  isSupported(): boolean {
    return "Notification" in window;
  },

  // Check current permission status
  isPermissionGranted(): boolean {
    return this.isSupported() && Notification.permission === "granted";
  },

  // Request notification permission (enhanced)
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      return "denied";
    }

    if (Notification.permission === "granted") {
      // Initialize service worker if permission already granted
      await this.init();
      return "granted";
    }

    if (Notification.permission === "denied") {
      return "denied";
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // Initialize service worker after getting permission
      await this.init();
    }

    return permission;
  },

  // Show notification (enhanced for mobile)
  show(title: string, body: string, type: NotificationType = "update"): void {
    // Play sound first
    this.playSound(type);

    // Try service worker notification first (better for mobile)
    if (this.serviceWorkerRegistration) {
      try {
        navigator.serviceWorker.ready.then((registration) => {
          // Send message to service worker to show notification
          if (registration.active) {
            registration.active.postMessage({
              type: "SHOW_NOTIFICATION",
              title,
              body,
              notificationType: type,
            });
            return;
          }
        });
      } catch (error) {
        console.warn(
          "Service worker notification failed, falling back to regular notification:",
          error
        );
      }
    }

    // Fallback to regular notification API
    if (!this.isPermissionGranted()) {
      return;
    }

    const options: NotificationOptions = {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: `queue-${type}`,
      requireInteraction: type === "next",
      silent: true, // We're playing our own custom sound
      // vibrate is not supported in NotificationOptions in browsers
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
