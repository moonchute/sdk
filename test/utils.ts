import type { CreateConfigParameters } from "../src/config";
import { createConfig } from "../src/config";

type Config = CreateConfigParameters;

export function setupConfig(config: Config = { apiKey: "test" }) {
  return createConfig({ ...config });
}
