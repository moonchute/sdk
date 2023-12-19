import { getPublicClient } from "@wagmi/core";
import axios from "axios";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import {
  WaitForUserOperationArgs,
  waitForUserOperation,
} from "./waitForUserOperation";

vi.mock("@wagmi/core", () => ({
  getPublicClient: vi.fn(),
}));
vi.mock("axios");

describe("waitFotUserOperation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully get unsigned user operation", async () => {
    const mockArgs: WaitForUserOperationArgs = {
      chainId: 1,
      appId: "someappId",
      userOpHash: "0xUoHash",
    };

    const mockPublicClient = {
      waitForTransactionReceipt: vi.fn().mockResolvedValue({
        transactionHash: "0xExampleTxHash",
        status: "success",
      }),
    };

    (getPublicClient as Mock).mockReturnValue(mockPublicClient);

    const mockResponse = {
      status: 200,
      data: {
        userOpHash: "0xExampleUserOpHash",
        receipt: {
          blockHash: "0xExampleBlockHash",
          transactionHash: "0xExampleTxHash",
        },
      },
    };

    (axios.request as Mock).mockResolvedValue(mockResponse);

    const result = await waitForUserOperation(mockArgs);

    expect(result).toEqual({
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
    });
    expect(mockPublicClient.waitForTransactionReceipt).toHaveBeenCalledWith({
      confirmations: 1,
      hash: "0xExampleTxHash",
      onReplaced: undefined,
      timeout: 0,
    });
  });
});
