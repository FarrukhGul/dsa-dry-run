import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

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
