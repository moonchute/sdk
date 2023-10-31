import type { Abi } from "abitype";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { renderHook } from "../../test";
import { usePrepareUserOperation } from "./usePrepareUserOperation";

describe("usePrepareUserOperation", () => {
  beforeAll(() => {
    vi.mock("../actions/getUnsignedUserOperation", () => ({
      getUnsignedUserOperation: vi.fn(() =>
        Promise.resolve({
          userOp: {
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
          },
          userOpHash: "0x123456",
          accountType: 1,
        })
      ),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("mounts", async () => {
    const account = "0x123456";
    const owner = "0x345678";
    const chainId = 1;
    const address = "0x456789";
    const value = "0";
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
    const isPaymaster = false;

    const { result, waitFor } = renderHook(() =>
      usePrepareUserOperation({
        account,
        owner,
        chainId,
        address,
        value,
        abi,
        functionName,
        isPaymaster,
      })
    );
    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    const { data, internal: _, ...res } = result.current;
    expect(data).toBeDefined();
    expect(res).toMatchInlineSnapshot(`
    {
      "error": null,
      "fetchStatus": "idle",
      "isError": false,
      "isFetched": true,
      "isFetchedAfterMount": true,
      "isFetching": false,
      "isIdle": false,
      "isLoading": false,
      "isRefetching": false,
      "isSuccess": true,
      "refetch": [Function],
      "status": "success",
    }
    `);
  });
});
