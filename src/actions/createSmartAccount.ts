import type { Abi } from "abitype";
import type { Address } from "viem";
import { SimulateContractParameters } from "viem";
import { getUnsignedUserOperation } from "./getUnsignedUserOperation";
import { sendUserOperation } from "./sendUserOperation";

export type CreateSmartAccountConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string
> = Omit<SimulateContractParameters<TAbi, TFunctionName>, "chain"> & {
  owner: Address;
  chainId: number;
  apikey: string;
};

export type CreateSmartAccountResult = {
  userOpHash: `0x${string}`;
};

export async function createSmartAccount(
  args: CreateSmartAccountConfig
): Promise<CreateSmartAccountResult> {
  const {
    owner,
    chainId,
    address,
    value,
    abi,
    functionName,
    args: functionArgs,
    apikey,
  } = args;

  const unsignedRes = await getUnsignedUserOperation({
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
