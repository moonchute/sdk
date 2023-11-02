import type { Abi } from "abitype";
import type { Address } from "viem";
import { getUnsignedUserOperation } from "./getUnsignedUserOperation";
import { sendUserOperation } from "./sendUserOperation";

export type CreateSmartAccountArgs = {
  owner: Address;
  chainId: number;
  apikey: string;
  address: Address;
  value?: bigint;
  abi: Abi;
  functionName: string;
  args?: any[];
};

export type CreateSmartAccountResult = {
  userOpHash: `0x${string}`;
};

export async function createSmartAccount(
  args: CreateSmartAccountArgs
): Promise<CreateSmartAccountResult> {
  const {
    owner,
    chainId,
    apikey,
    address,
    value,
    abi,
    functionName,
    args: functionArgs,
  } = args;

  const unsignedRes = await getUnsignedUserOperation({
    account: "0x",
    owner,
    chainId,
    address,
    value,
    abi,
    functionName,
    args: functionArgs,
    apikey,
  });

  const { userOp, userOpHash, accountType } = unsignedRes;

  return await sendUserOperation({
    userOp,
    userOpHash,
    chainId,
    accountType,
    apikey,
  });
}
