import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  worker: {
    format: "es",
    rollupOptions: {
      output: {
        /*
         * Put the dry run worker at a fixed, predictable path.
         *
         * Normally a bundler adds a random hash to every filename. We need this
         * one to stay put, because it is the single file allowed to compile
         * code at runtime, and public/_headers gives everything under
         * /workers/ its own much stricter security policy. You cannot write a
         * rule for a filename that changes on every build.
         */
        entryFileNames: "workers/dry-run-worker.js",
        chunkFileNames: "workers/[name]-[hash].js",
      },
    },
  },

  build: {
    modulePreload: {
      // Vite normally injects a small INLINE script here to support very old
      // Safari. Our Content Security Policy blocks inline scripts on purpose
      // (see public/_headers), so we turn the polyfill off and keep the policy
      // strict. Every browser from the last few years works without it.
      polyfill: false,
    },
  },
});
