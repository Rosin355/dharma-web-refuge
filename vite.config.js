import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react({ jsxRuntime: 'automatic' }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname || ".", "src"),
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignora gli avvisi di TypeScript
        if (warning.code === 'UNRESOLVED_IMPORT') return;
        warn(warning);
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}));