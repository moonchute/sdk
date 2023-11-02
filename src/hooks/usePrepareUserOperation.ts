import type { Abi } from "abitype";
import * as React from "react";
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
// type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type UsePrepareUserOperationConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string
> = PartialBy<
  Omit<
    GetUnsignedUserOperationConfig<TAbi, TFunctionName>,
    "apikey" | "chainId" | "owner"
  >,
  "abi" | "address" | "functionName"
> &
  Partial<GetFunctionArgs<TAbi, TFunctionName>> &
  QueryConfig<GetUnsignedUserOperationResult, Error>;

type QueryKeyArgs = Partial<
  Omit<GetUnsignedUserOperationConfig, "abi" | "apikey">
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
  apikey,
}: {
  abi?: Abi | readonly unknown[];
  apikey?: string;
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
    if (!abi) {
      throw new Error("abi is required");
    }
    if (!functionName) {
      throw new Error("functionName is required");
    }
    if (!apikey) {
      throw new Error("apikey is required");
    }
    if (!chainId) {
      throw new Error("chainId is required");
    }

    return getUnsignedUserOperation({
      account,
      owner,
      chainId,
      apikey,
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
  const apikey = config.apikey;

  const queryKey_ = React.useMemo(
    () =>
      queryKey({
        account,
        owner: ownerAddress,
        chainId: chain?.id,
        address,
        value,
        functionName,
        args: args as readonly unknown[],
      }),
    [account, address, value, functionName, chain, ownerAddress, args]
  );

  const smartAccountsQuery = useQuery(
    queryKey_,
    queryFn({ abi: abi as Abi, apikey }),
    {}
  );
  return smartAccountsQuery;
}
