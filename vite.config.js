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

      manifest: {
        name: "ktab",
        short_name: "ktab",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#6B4F3F", 
        background_color: "#FFFFFF", 

        icons: [
          {
            src: "192logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "512logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      workbox: {
        navigateFallback: "/index.html",
      },

      devOptions: {
        enabled: true, // important for ngrok testing
      },
    }),
  ],

  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "melisa-balsamiferous-aubrie.ngrok-free.dev",
      ".ngrok-free.dev",
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
