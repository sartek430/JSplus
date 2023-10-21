import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173, // Utilisez le port 5173
    open: "/login", // Ouvre l'URL http://localhost:5173/login au démarrage
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
});
