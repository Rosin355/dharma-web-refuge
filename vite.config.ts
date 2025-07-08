import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// CONFIGURAZIONE TYPESCRIPT CORRETTA PER RISOLVERE ERRORI DI BUILD
export default defineConfig(({ mode }) => ({
  plugins: [
    react({ 
      jsxRuntime: 'automatic',
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
    jsx: 'automatic',
    jsxImportSource: 'react',
    tsconfigRaw: {
      compilerOptions: {
        target: 'es2020',
        lib: ['es2020', 'DOM', 'DOM.Iterable'],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: false,
        forceConsistentCasingInFileNames: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        jsxImportSource: 'react',
        downlevelIteration: true
      }
    }
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