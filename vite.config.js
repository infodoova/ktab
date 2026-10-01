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
        // Only precache essential app shell code (JS/CSS/HTML/icons); media and artwork are cached on demand
        globPatterns: ["**/*.{js,css,html,ico,svg,webmanifest}"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /\/assets\/.*\.(png|jpg|jpeg|gif|webp|svg|mp3|mp4)/,
            handler: "CacheFirst",
            options: {
              cacheName: "media-assets-cache",
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                maxEntries: 100,
              },
            },
          },

          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                maxEntries: 30,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
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
      "127.0.0.1",
    ],
  },
  
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: [
      "ktab.app",
      ".ktab.app",
      "localhost",
      "127.0.0.1",
    ],
  },

  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 800,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("pdfjs-dist")) {
              return "vendor-pdf";
            }
            if (id.includes("recharts") || id.includes("d3-")) {
              return "vendor-charts";
            }
            if (id.includes("framer-motion") || id.includes("gsap")) {
              return "vendor-animations";
            }
            if (id.includes("react-router") || id.includes("zustand")) {
              return "vendor-core";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
          }
        },
      },
    },
  },
});

