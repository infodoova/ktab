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
        globPatterns: ["*/.{js,css,html,ico,png,svg,mp4}"], // Include mp4 for caching
        maximumFileSizeToCacheInBytes: 100 * 1024 * 1024, // Set to 100 MB for larger files
        runtimeCaching: [
          {
            urlPattern: /\/assets\/.*\.(png|jpg|jpeg|gif|webp|mp4|svg)/, // Cache all assets including images and videos
            handler: "CacheFirst",
            options: {
              cacheName: "assets-cache",
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
                maxEntries: 50, // Limit to 50 files
              },
            },
          },
        ],
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
    rollupOptions: {
      output: {
        manualChunks: {
          // Example of manual chunking large video files
          videoChunks: ['src/assets/videos/heromob.mp4', 'src/assets/videos/audiobook.mp4'],
        },
      },
    },
  },
});
