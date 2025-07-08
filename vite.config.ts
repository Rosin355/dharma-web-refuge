import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Importazione condizionale per evitare errori se lovable-tagger non è disponibile
let componentTagger;
try {
  componentTagger = require("lovable-tagger").componentTagger;
} catch (e) {
  // lovable-tagger non disponibile in ambiente locale
  componentTagger = null;
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Usa componentTagger solo se disponibile e in development
    mode === 'development' && componentTagger && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
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
  },
  define: {
    __DEV__: mode === 'development'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  }
}));
