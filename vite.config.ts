// Static build for GitHub Pages: every page is prerendered to plain HTML in dist/client.
// @lovable.dev/vite-tanstack-config already includes TanStack Start, React, Tailwind and the @ alias.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: false,
  tanstackStart: {
    server: { entry: "server" },
    prerender: { enabled: true, crawlLinks: true, failOnError: true },
  },
});
