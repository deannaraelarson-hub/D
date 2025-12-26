import { defineConfig } from "vite";

export default defineConfig({
  base: "/D/", // Critical: GitHub Pages serves from /D/
  server: {
    port: 5173,
    strictPort: true
  }
});
