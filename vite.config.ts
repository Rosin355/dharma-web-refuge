import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxImportSource: 'react'
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      onwarn: () => {
        return;
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  esbuild: {
    target: 'es2020',
    jsx: 'automatic'
  },
  css: {
    devSourcemap: false
  },
  define: {
    global: 'globalThis'
  },
  logLevel: 'warn',
  clearScreen: false
}));