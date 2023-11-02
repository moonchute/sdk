import type { Abi } from "abitype";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { renderHook } from "../../test";
import { usePrepareUserOperation } from "./usePrepareUserOperation";

describe("usePrepareUserOperation", () => {
  beforeAll(() => {
    vi.mock("wagmi", async () => {
      const actual: any = await vi.importActual("wagmi");
      return {
        ...actual,
        useAccount: vi.fn(() => "0x27FB75d177E01103827068357cbaBEDa12ed7e1C"),
        useNetwork: vi.fn(() => ({
          chain: {
            id: 1,
          },
        })),
      };
    });

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
    const account = "0x27FB75d177E01103827068357cbaBEDa12ed7e1C";
    const address = "0x456789";
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

    const { result, waitFor } = renderHook(() =>
      usePrepareUserOperation({
        account,
        address,
        value,
        abi,
        functionName,
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
