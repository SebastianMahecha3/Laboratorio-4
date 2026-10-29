import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Puerto público (front): 5173  |  Puerto privado (API json-server): 3000
// El proxy /api -> localhost:3000 permite que funcione también en GitHub Codespaces.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
