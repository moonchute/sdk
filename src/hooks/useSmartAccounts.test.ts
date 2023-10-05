import { describe, expect, it } from "vitest";
import { renderHook } from "../../test";
import { useSmartAccounts } from "./useSmartAccounts";

describe("useSmartAccounts", () => {
  it("mounts", async () => {
    const address = "0x123456";
    const chainId = 1;

    const { result, waitFor } = renderHook(() =>
      useSmartAccounts({ address, chainId })
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
