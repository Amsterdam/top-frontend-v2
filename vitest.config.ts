import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    environment: "jsdom",
    server: {
      deps: {
        // Processed by Vite (see the alias below) instead of loaded by Node.
        inline: ["@amsterdam/ee-ads-rhf"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      // ee-ads-rhf has no "exports", so Vitest picks its CommonJS "main", which requires the
      // CommonJS react-hook-form: a second instance with its own form context, so its controls
      // can't see the FormProvider of the tested components. Its ESM build shares our instance.
      "@amsterdam/ee-ads-rhf": path.resolve(
        import.meta.dirname,
        "node_modules/@amsterdam/ee-ads-rhf/dist/index.esm.js",
      ),
    },
  },
})
