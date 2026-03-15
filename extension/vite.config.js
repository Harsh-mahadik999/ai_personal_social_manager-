import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "public/manifest.json", dest: "." },
        { src: "src/background/service-worker.js", dest: "background" },
        { src: "src/content/content-script.js", dest: "content" }
      ]
    })
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
