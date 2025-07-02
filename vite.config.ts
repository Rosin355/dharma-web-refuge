
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
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
    rollupOptions: {
      onwarn(warning, warn) {
        // Skip all TypeScript and config related warnings
        if (warning.code === 'UNRESOLVED_IMPORT') return;
        if (warning.code === 'PLUGIN_WARNING') return;
        if (warning.code === 'TYPESCRIPT_ERROR') return;
        warn(warning);
      }
    }
  },
  esbuild: {
    target: 'esnext',
    loader: 'tsx',
    include: /\.(tsx?|jsx?)$/,
    exclude: [],
    // Completely override TypeScript config to bypass project references
    tsconfigRaw: {
      compilerOptions: {
        target: "esnext",
        lib: ["dom", "dom.iterable", "es6"],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: false,
        forceConsistentCasingInFileNames: true,
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        // Disable all type checking and references
        noImplicitAny: false,
        noImplicitReturns: false,
        noImplicitThis: false,
        strictNullChecks: false
      },
      // Explicitly remove any project references
      references: undefined,
      extends: undefined
    }
  },
  define: {
    __DEV__: mode === 'development'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      loader: {
        '.ts': 'tsx',
        '.tsx': 'tsx'
      }
    }
  }
}));
