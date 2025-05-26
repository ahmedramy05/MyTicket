import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dependencies } from "./package.json"; // Import dependencies from package.json

// Generate an array of all dependencies to mark them as external
const externalDependencies = dependencies ? Object.keys(dependencies) : [];

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      external: externalDependencies, // Mark all dependencies as external
    },
  },
});
