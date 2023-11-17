import { getPublicClient } from "@wagmi/core";
import type { Abi } from "abitype";
import axios from "axios";
import { encodeFunctionData, SimulateContractParameters } from "viem";
import { userOperationType } from "../types";

type PartialBy<TType, TKeys extends keyof TType> = Partial<Pick<TType, TKeys>> &
  Omit<TType, TKeys>;

export type GetUnsignedUserOperationConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string
> = PartialBy<
  Omit<
    SimulateContractParameters<TAbi, TFunctionName>,
    "chain" | "account" | "value"
  >,
  "functionName"
> & {
  account?: string;
  owner?: string;
  chainId: number;
  appId: string;
  value?: bigint;
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
  appId,
  abi,
  functionName,
  args,
  address,
  value,
}: GetUnsignedUserOperationConfig): Promise<GetUnsignedUserOperationResult> {
  const publicClient = getPublicClient({ chainId });
  let calldata = "0x";

  if (abi && functionName) {
    await publicClient.simulateContract({
      abi,
      address,
      functionName,
      args,
      account: account === "0x" ? undefined : account,
    } as SimulateContractParameters);
    calldata = encodeFunctionData({
      abi,
      args,
      functionName,
    });
  }
  const unsigned_options = {
    method: "POST",
    url: "https://api.moonchute.xyz/userop",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "x-app-id": appId,
    },
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
          value: value?.toString() || "0",
          data: calldata,
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
