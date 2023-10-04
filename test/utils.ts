import type { CreateConfigParameters } from "../src/config";
import { createConfig } from "../src/config";

type Config = Partial<CreateConfigParameters>;

export function setupConfig(config: Config = {}) {
  return createConfig({ ...config });
}
