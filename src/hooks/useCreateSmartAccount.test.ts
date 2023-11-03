import type { Abi } from "abitype";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "../../test";
import { useCreateSmartAccount } from "./useCreateSmartAccount"; // replace 'yourFile' with the actual file name

describe("useCreateSmartAccount", () => {
  beforeAll(() => {
    vi.mock("wagmi", async () => {
      const actual: any = await vi.importActual("wagmi");
      return {
        ...actual,
        useAccount: vi.fn(() => ({
          address: "0x27FB75d177E01103827068357cbaBEDa12ed7e1C",
        })),
        useNetwork: vi.fn(() => ({
          chain: {
            id: 1,
          },
        })),
      };
    });
    vi.mock("../actions/createSmartAccount", () => ({
      createSmartAccount: vi.fn(() =>
        Promise.resolve({
          sender: "0x",
          userOpHash: "0x",
        })
      ),
    }));
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("mounts", () => {
    it("initial state", async () => {
      const { result } = renderHook(() =>
        useCreateSmartAccount(undefined as any)
      );

      expect(result.current).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "error": null,
        "isError": false,
        "isIdle": true,
        "isLoading": false,
        "isSuccess": false,
        "mutate": [Function],
        "mutateAsync": [Function],
        "reset": [Function],
        "status": "idle",
        "variables": undefined,
        "write": undefined,
      }
      `);
    });

    it("prepared", async () => {
      const owner: `0x${string}` = "0x27FB75d177E01103827068357cbaBEDa12ed7e1C";
      const chainId = 1;
      const address: `0x${string}` = "0x456789";
      const value = 0n;
      const functionName = "mint";
      const abi: Abi = [
        {
          inputs: [],
          name: "mint",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ];
      const config = {
        owner,
        chainId,
        address,
        value,
        functionName,
        abi,
        appId: "123",
        // more properties...
      };

      const { result, waitFor } = renderHook(() =>
        useCreateSmartAccount(config)
      );

      await waitFor(() => expect(result.current.write).toBeDefined());

      await act(async () => result.current.write?.());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });
  });
});
