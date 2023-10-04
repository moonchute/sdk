import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      reporter: ["text", "json", "html"],
    },
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    setupFiles: ["./test/setup.ts"],
  },
});
