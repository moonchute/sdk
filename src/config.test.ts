import { describe, expect, it } from "vitest";
import { Config, createConfig } from "./config";
import { createStorage } from "./storage";

describe("createConfig", () => {
  it("returns config", () => {
    const config = createConfig({ apiKey: "test" });
    expect(config).toBeInstanceOf(Config);
  });

  describe("config", () => {
    describe("storage", () => {
      it("default", () => {
        const config = createConfig({ apiKey: "test" });
        expect(config.storage).toMatchInlineSnapshot(`
          {
            "getItem": [Function],
            "removeItem": [Function],
            "setItem": [Function],
          }
        `);
      });

      it("custom", () => {
        const config = createConfig({
          storage: createStorage({
            storage: window.localStorage,
          }),
          apiKey: "test",
        });
        expect(config.storage).toMatchInlineSnapshot(`
          {
            "getItem": [Function],
            "removeItem": [Function],
            "setItem": [Function],
          }
        `);
      });
    });
  });
});
