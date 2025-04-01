import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'PUBLIC_']);

  return {
    base: "/",
    server: {
      host: "::", // IPv6 and IPv4
      port: parseInt(env.PORT || '8080'),
      strictPort: true, // Exit if port is in use
    },
    preview: {
      host: "::",
      port: parseInt(env.PORT || '8080'),
      strictPort: true,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger()
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: mode === "development", // Only in dev
      rollupOptions: {
        output: {
          manualChunks: {
            // Add vendor chunks for better caching
            react: ['react', 'react-dom'],
            vendor: ['lodash', 'axios'],
          },
        },
      },
    },
    define: {
      'process.env': env, // Expose env variables to client
      __APP_ENV__: JSON.stringify(mode), // Expose mode to client
    },
  };
});