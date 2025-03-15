import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { imagetools } from "vite-imagetools";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    imagetools(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 500, // Ensures chunks are below 500KB
    rollupOptions: {
      external: ["zod"],
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react-vendor"; 
            if (id.includes("recharts")) return "recharts-vendor"; 
            if (id.includes("radix-ui")) return "radix-vendor"; 
            if (id.includes("@tanstack/react-query")) return "react-query"; 
          }
        },
      },
    },
  },
}));
