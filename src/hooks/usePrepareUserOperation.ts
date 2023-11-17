import type { Abi } from "abitype";
import type { GetFunctionArgs } from "viem";
import { isAddress } from "viem";
import { useAccount, useNetwork } from "wagmi";
import {
  GetUnsignedUserOperationConfig,
  GetUnsignedUserOperationResult,
  getUnsignedUserOperation,
} from "../actions/getUnsignedUserOperation";
import { useConfig } from "../context";
import type { QueryConfig, QueryFunctionArgs } from "../types";
import { useQuery } from "./query";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<TType, TKeys extends keyof TType> = Partial<Pick<TType, TKeys>> &
  Omit<TType, TKeys>;

export type UsePrepareUserOperationConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string
> = PartialBy<
  Omit<
    GetUnsignedUserOperationConfig<TAbi, TFunctionName>,
    "appId" | "chainId" | "owner"
  >,
  "abi" | "address" | "functionName"
> &
  Partial<GetFunctionArgs<TAbi, TFunctionName>> &
  QueryConfig<GetUnsignedUserOperationResult, Error>;

type QueryKeyArgs = Partial<
  Omit<GetUnsignedUserOperationConfig, "abi" | "appId">
>;
type QueryKeyConfig = Pick<UsePrepareUserOperationConfig, "scopeKey">;

function queryKey({
  account,
  owner,
  chainId,
  address,
  functionName,
  args,
  value,
}: QueryKeyArgs & QueryKeyConfig) {
  return [
    {
      entity: "prepareUserOperation",
      account,
      owner,
      chainId,
      address,
      functionName,
      args,
      value,
    },
  ] as const;
}
function queryFn({
  abi,
  appId,
}: {
  abi?: Abi | readonly unknown[];
  appId?: string;
}) {
  return ({
    queryKey: [{ account, owner, address, chainId, value, functionName, args }],
  }: QueryFunctionArgs<typeof queryKey>) => {
    if (!account && (!owner || !isAddress(owner))) {
      throw new Error("owner is required for creating account");
    }
    if (account && !isAddress(account)) {
      throw new Error("account is not a valid address");
    }
    if (!address) {
      throw new Error("address is required");
    }
    if (abi) {
      if (!functionName) {
        throw new Error("functionName is required");
      }
    }
    if (functionName) {
      if (!abi) {
        throw new Error("abi is required");
      }
    }
    if (!functionName && !abi && !value) {
      throw new Error("functionName or value is required");
    }

    if (!appId) {
      throw new Error("appId is required");
    }
    if (!chainId) {
      throw new Error("chainId is required");
    }

    return getUnsignedUserOperation({
      account,
      owner,
      chainId,
      appId,
      address,
      value,
      abi: abi as Abi,
      functionName,
      args,
    });
  };
}

export function usePrepareUserOperation<TAbi extends Abi | readonly unknown[]>({
  account,
  address,
  value,
  abi,
  functionName,
  args,
}: UsePrepareUserOperationConfig<TAbi>) {
  const config = useConfig();
  const { chain } = useNetwork();
  const { address: ownerAddress } = useAccount();
  const appId = config.appId;

  const prepareUserOperationQuery = useQuery(
    queryKey({
      account,
      owner: ownerAddress,
      chainId: chain?.id,
      address,
      value,
      functionName,
      args: args as readonly unknown[],
    }),
    queryFn({ abi: abi as Abi, appId }),
    {}
  );
  return Object.assign(prepareUserOperationQuery, {
    config: {
      ...prepareUserOperationQuery.data,
    } as GetUnsignedUserOperationResult,
  });
}
