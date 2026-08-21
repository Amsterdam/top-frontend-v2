import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"
import { resolve } from "path"

// https://vite.dev/config/
export default defineConfig({
  css: {
    devSourcemap: true,
  },
  plugins: [
    react(),
    VitePWA({
      injectRegister: "auto",
      manifest: false,
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\//],
      },
      includeAssets: [
        "favicon.ico",
        "favicon/favicon.ico",
        "favicon/icon.svg",
        "favicon/apple-touch-icon.png",
        "app-icons/icon-192.png",
        "app-icons/icon-512.png",
      ],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
        disableDevLogs: true,
        runtimeCaching: [
          {
            urlPattern: /\/config\/env\.js$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "runtime-config",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\/favicon(?:\/.*)?\.(?:ico|svg)$/,
            method: "GET",
            handler: "CacheFirst",
            options: {
              cacheName: "favicon-runtime",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https?:\/\/.*\/api\/v1\/.*$/,
            method: "GET",
            handler: "NetworkFirst",
            options: {
              cacheName: "api-runtime",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern:
              /^https:\/\/api\.pdok\.nl\/bzk\/locatieserver\/search\/v3_1\/.*$/,
            method: "GET",
            handler: "NetworkFirst",
            options: {
              cacheName: "pdok-runtime",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
})
