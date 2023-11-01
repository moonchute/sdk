import { getPublicClient } from "@wagmi/core";
import type { Abi } from "abitype";
import axios from "axios";
import type { Address } from "viem";
import { encodeFunctionData } from "viem";
import { userOperationType } from "../types";

export type GetUnsignedUserOperationArgs = {
  account?: Address;
  owner?: Address;
  chainId: number;
  apikey: string;
  address: Address;
  value: string;
  isPaymaster: boolean;
  abi: Abi;
  functionName: string;
  args?: any[];
};

export type GetUnsignedUserOperationResult = {
  userOpHash: `0x${string}`;
  accountType: number;
  userOp: userOperationType;
  chainId: number;
};

export async function getUnsignedUserOperation({
  account,
  owner,
  chainId,
  apikey,
  abi,
  functionName,
  args,
  address,
  value,
  isPaymaster = true,
}: GetUnsignedUserOperationArgs): Promise<GetUnsignedUserOperationResult> {
  const publicClient = getPublicClient({ chainId });

  await publicClient.simulateContract({
    abi,
    address,
    functionName,
    args,
    account: account === "0x" ? undefined : account,
  });

  const calldata = encodeFunctionData({
    abi,
    args,
    functionName,
  });

  const unsigned_options = {
    method: "POST",
    url: "https://api.moonchute.xyz/userop",
    headers: { accept: "application/json", "content-type": "application/json" },
    data: {
      jsonrpc: "2.0",
      id: 1,
      method: "mc_getUnsignedUserOp",
      params: [
        {
          account,
          owner,
          chainId,
          to: address,
          value: value || 0,
          data: calldata,
          isPaymaster,
        },
      ],
    },
  };
  const res = await axios.request(unsigned_options);
  if (res.status !== 200) {
    throw new Error(`Failed to get unsigned user operation: ${res.data}`);
  }
  return res.data;
}
