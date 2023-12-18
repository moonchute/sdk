import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { renderHook } from "../../test";
import { useWaitForUserOperation } from "./useWaitForUserOperation";

describe("useWaitForUserOperation", () => {
  beforeAll(() => {
    vi.mock("../actions/waitForUserOperations", () => ({
      waitForUserOperation: vi.fn(() =>
        Promise.resolve({
          txReceipt: {
            transactionHash: "0xExampleTxHash",
            status: "success",
          },
          userOpReceipt: {
            userOpHash: "0xExampleUserOpHash",
            receipt: {
              blockHash: "0xExampleBlockHash",
              transactionHash: "0xExampleTxHash",
            },
          },
        })
      ),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("mounts", async () => {
    const userOpHash = "0x123456";
    const chainId = 80001;

    const { result, waitFor } = renderHook(() =>
      useWaitForUserOperation({
        userOpHash,
        chainId,
      })
    );
    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    const { data, internal: _, ...res } = result.current;
    expect(data).toBeDefined();
    expect(data).toMatchInlineSnapshot(`
    {
      "txReceipt": {
        "status": "success",
        "transactionHash": "0xExampleTxHash",
      },
      "userOpReceipt": {
        "receipt": {
          "blockHash": "0xExampleBlockHash",
          "transactionHash": "0xExampleTxHash",
        },
        "userOpHash": "0xExampleUserOpHash",
      },
    }
    `);
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
