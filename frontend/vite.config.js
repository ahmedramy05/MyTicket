import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
  // Remove the build.rollupOptions.external configuration
  resolve: {
    alias: {
      // Ensure proper module resolution
      'react': 'react',
      'react-dom': 'react-dom'
    }
  }
});
