import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderHook } from "../test";
import { useConfig } from "./context";

describe("useConfig", () => {
  describe("mounts", () => {
    it("default", () => {
      const { result } = renderHook(() => useConfig());
      expect(result.current).toMatchInlineSnapshot(`
      Config {
        "queryClient": QueryClient {
          "defaultOptions": {
            "queries": {
              "cacheTime": Infinity,
              "retry": false,
            },
          },
          "logger": {
            "error": [Function],
            "log": [Function],
            "warn": [Function],
          },
          "mountCount": 1,
          "mutationCache": MutationCache {
            "config": {},
            "listeners": Set {},
            "mutationId": 0,
            "mutations": [],
            "subscribe": [Function],
          },
          "mutationDefaults": [],
          "queryCache": QueryCache {
            "config": {},
            "listeners": Set {},
            "queries": [],
            "queriesMap": {},
            "subscribe": [Function],
          },
          "queryDefaults": [],
          "unsubscribeFocus": [Function],
          "unsubscribeOnline": [Function],
        },
        "storage": {
          "getItem": [Function],
          "removeItem": [Function],
          "setItem": [Function],
        },
        "store": {
          "destroy": [Function],
          "getState": [Function],
          "persist": {
            "clearStorage": [Function],
            "getOptions": [Function],
            "hasHydrated": [Function],
            "onFinishHydration": [Function],
            "onHydrate": [Function],
            "rehydrate": [Function],
            "setOptions": [Function],
          },
          "setState": [Function],
          "subscribe": [Function],
        },
      }
      `);
    });

    it("throw when not inside Provider", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      let err;
      try {
        const wrapper = ({ children }: { children: React.ReactNode }) =>
          React.createElement("div", { children });
        renderHook(() => useConfig(), { wrapper });
      } catch (error) {
        err = error;
      } finally {
        expect(err).toMatchInlineSnapshot(
          `
          [Error: useConfig must be used within a MoonChuteConfig]
          `
        );
      }
    });
  });
});
