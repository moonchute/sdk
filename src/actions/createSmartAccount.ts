import type { Abi } from "abitype";
import type { Address } from "viem";
import { SimulateContractParameters } from "viem";
import { getUnsignedUserOperation } from "./getUnsignedUserOperation";
import { sendUserOperation } from "./sendUserOperation";

type PartialBy<TType, TKeys extends keyof TType> = Partial<Pick<TType, TKeys>> &
  Omit<TType, TKeys>;

export type CreateSmartAccountConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string
> = PartialBy<
  Omit<SimulateContractParameters<TAbi, TFunctionName>, "chain">,
  "functionName"
> & {
  owner: Address;
  chainId: number;
  appId: string;
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
    appId,
  } = args;

  const unsignedRes = await getUnsignedUserOperation({
    owner,
    chainId,
    address,
    value,
    abi,
    functionName,
    args: functionArgs,
    appId,
  });

  const { userOp, userOpHash, accountType } = unsignedRes;

  return await sendUserOperation({
    userOp,
    userOpHash,
    chainId,
    accountType,
    appId,
  });
}
