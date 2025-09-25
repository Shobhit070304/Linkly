import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }) => {
  const config = {
    plugins: [react(), tailwindcss()],

    // Pre-bundle Firebase submodules for Vite
    optimizeDeps: {
      include: [
        "firebase/app",
        "firebase/auth",
        "firebase/firestore",
        "firebase/analytics"
      ]
    }
  };

  if (command === "build") {
    config.build = {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            ui: ["@heroicons/react", "framer-motion", "lucide-react", "react-icons"],
            firebase: [
              "firebase/app",
              "firebase/auth",
              "firebase/firestore"
            ]
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: mode === "production" ? false : true
    };
  }

  return config;
});
