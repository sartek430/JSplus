import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/MeteoPlus/accueil",
  server: {
    port: 5173,
    open: "/MeteoPlus/accueil",
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
});
