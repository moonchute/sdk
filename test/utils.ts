import type { CreateConfigParameters } from "../src/config";
import { createMoonChuteConfig } from "../src/config";

type Config = CreateConfigParameters;

export function setupConfig(config: Config = { apiKey: "test" }) {
  return createMoonChuteConfig({ ...config });
}
