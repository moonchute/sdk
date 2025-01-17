import { describe, expect, it } from "vitest";
import { Config, createMoonChuteConfig } from "./config";
import { createStorage } from "./storage";

describe("createConfig", () => {
  it("returns config", () => {
    const config = createMoonChuteConfig({ appId: "test" });
    expect(config).toBeInstanceOf(Config);
  });

  describe("config", () => {
    describe("storage", () => {
      it("default", () => {
        const config = createMoonChuteConfig({ appId: "test" });
        expect(config.storage).toMatchInlineSnapshot(`
          {
            "getItem": [Function],
            "removeItem": [Function],
            "setItem": [Function],
          }
        `);
      });

      it("custom", () => {
        const config = createMoonChuteConfig({
          storage: createStorage({
            storage: window.localStorage,
          }),
          appId: "test",
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
