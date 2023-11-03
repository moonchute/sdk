import { getPublicClient } from "@wagmi/core";
import axios from "axios";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import {
  GetUnsignedUserOperationArgs,
  getUnsignedUserOperation,
} from "./getUnsignedUserOperation";

// Mock the getPublicClient function
vi.mock("@wagmi/core", () => ({
  getPublicClient: vi.fn(),
}));
vi.mock("viem", () => ({
  encodeFunctionData: vi.fn(),
}));

// Mock axios
vi.mock("axios");

describe("getUnsignedUserOperation", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods
    vi.clearAllMocks();
  });

  it("should successfully get unsigned user operation", async () => {
    const mockArgs: GetUnsignedUserOperationArgs = {
      account: "0xSomeAccount",
      owner: "0xSomeOwner",
      chainId: 1,
      appId: "someappId",
      address: "0xToAddress",
      value: "someValue",
      isPaymaster: true,
      abi: [
        {
          inputs: [],
          name: "someFunctionName",
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
      ],
      functionName: "someFunctionName",
      args: [],
    };

    const mockPublicClient = {
      simulateContract: vi.fn().mockResolvedValue("someSimulationResult"),
    };

    (getPublicClient as Mock).mockReturnValue(mockPublicClient);

    const mockResponse = {
      status: 200,
      data: "someResponseData",
    };

    (axios.request as Mock).mockResolvedValue(mockResponse);

    const result = await getUnsignedUserOperation(mockArgs);

    expect(result).toEqual("someResponseData");
    expect(mockPublicClient.simulateContract).toHaveBeenCalledWith({
      abi: mockArgs.abi,
      address: mockArgs.address,
      functionName: mockArgs.functionName,
      args: mockArgs.args,
      account: mockArgs.account,
    });
  });

  it("should throw an error when the status is not 200", async () => {
    (axios.request as Mock).mockResolvedValue({
      status: 400,
      data: "errorResponse",
    });

    await expect(
      getUnsignedUserOperation({
        chainId: 1,
        appId: "someappId",
        address: "0xToAddress",
        value: "someValue",
        isPaymaster: true,
        abi: [
          {
            inputs: [],
            name: "someFunctionName",
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
        ],
        functionName: "someFunctionName",
      })
    ).rejects.toThrow("Failed to get unsigned user operation: errorResponse");
  });
});
