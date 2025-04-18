/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    exclude: [...configDefaults.exclude],
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      all: true,
      exclude: [
        ...(configDefaults.coverage.exclude || []),
        ".next/*",
        "next.config.ts",
      ],
    },
  },
});
