import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Allow external connections
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Disable source maps in production for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          forms: ["react-hook-form"],
          ui: ["react-hot-toast"],
        },
      },
    },
  },
  define: {
    // Ensure environment variables are available
    "process.env": process.env,
  },
});
