import type { CreateConfigParameters } from "../src/config";
import { createMoonChuteConfig } from "../src/config";

type Config = CreateConfigParameters;

export function setupConfig(config: Config = { appId: "test" }) {
  return createMoonChuteConfig({ ...config });
}
