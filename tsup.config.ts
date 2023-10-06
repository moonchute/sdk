import { defineConfig } from "tsup";

import { dependencies, peerDependencies } from "./package.json";
import { getConfig } from "./scripts/tsup";

export default defineConfig(
  getConfig({
    banner: {
      js: '"use client";',
    },
    dev: process.env.DEV === "true",
    entry: ["src/index.ts"],
    external: [...Object.keys(dependencies), ...Object.keys(peerDependencies)],
    platform: "browser",
  })
);
