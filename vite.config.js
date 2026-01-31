import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["192logo.png", "512logo.png"],
      manifest: {
        name: "Ktab | كتاب",
        short_name: "Ktab",
        description: "منصة كتاب للقراءة الإلكترونية",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#5de3ba",
        background_color: "#0c0c0c",
        orientation: "portrait",
        icons: [
          { src: "/192logo.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/192logo.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/512logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/512logo.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        maximumFileSizeToCacheInBytes: 100 * 1024 * 1024,
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "ktab.app",
      ".ktab.app",
      ".ngrok-free.dev",
      "localhost",
      "127.0.0.1"
    ],
  },
  
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: [
      "ktab.app",
      ".ktab.app",
      "localhost",
      "127.0.0.1"
    ],
  },

  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});