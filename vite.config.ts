import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/scheduler/") ||
              id.includes("node_modules/use-sync-external-store/") ||
              id.includes("node_modules/loose-envify/") ||
              id.includes("node_modules/object-assign/")
            ) {
              return "react";
            }
            if (id.includes("react-router")) return "router";
            if (id.includes("@radix-ui")) return "radix";
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("recharts") || id.includes("d3")) return "charts";
            return "vendor";
          }
        },
      },
    },
  },
})
