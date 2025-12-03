import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    allowedHosts: ["interes-compuesto-production-ba57.up.railway.app"],
  },
});
