import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "../../test";
import { userOperationType } from "../types";
import { useSendUserOperation } from "./useSendUserOperation";

describe("useSendUserOperation", () => {
  beforeAll(() => {
    vi.mock("../actions/sendUserOperation", () => ({
      sendUserOperation: vi.fn(() =>
        Promise.resolve({
          userOpHash: "0x",
        })
      ),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe("mounts", () => {
    it("not prepared", async () => {
      const { result } = renderHook(() =>
        useSendUserOperation(undefined as any)
      );

      expect(result.current).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "error": null,
        "isError": false,
        "isIdle": true,
        "isLoading": false,
        "isSuccess": false,
        "reset": [Function],
        "status": "idle",
        "variables": undefined,
        "write": undefined,
      }
      `);
    });

    it("prepared", async () => {
      const userOp: userOperationType = {
        sender: "0x",
        nonce: "0",
        initCode: "0x",
        callData: "0x",
        callGasLimit: "0x",
        verificationGasLimit: "0x",
        preVerificationGas: "0x",
        maxFeePerGas: "0x",
        maxPriorityFeePerGas: "0x",
        paymasterAndData: "0x",
        signature: "0x",
      };
      const userOpHash = "0x123456";
      const accountType = 1;
      const chainId = 80001;

      const { result, waitFor } = renderHook(() =>
        useSendUserOperation({
          userOp,
          userOpHash,
          accountType,
          chainId,
        })
      );
      await waitFor(() => expect(result.current.write).toBeDefined());

      await act(async () => result?.current?.write?.());

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });
});
