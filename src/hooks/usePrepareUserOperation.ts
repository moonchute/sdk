import * as React from "react";
import { useAccount, useNetwork } from "wagmi";
import {
  GetUnsignedUserOperationArgs,
  GetUnsignedUserOperationResult,
  getUnsignedUserOperation,
} from "../actions/getUnsignedUserOperation";
import { useConfig } from "../context";
import type { QueryConfig, QueryFunctionArgs } from "../types";
import { useQuery } from "./query";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type UsePrepareUserOperationArgs = Partial<
  WithOptional<GetUnsignedUserOperationArgs, "apikey">
>;

export type UsePrepareUserOperationConfig = QueryConfig<
  GetUnsignedUserOperationResult,
  Error
>;

type QueryKeyArgs = UsePrepareUserOperationArgs;
type QueryKeyConfig = Pick<UsePrepareUserOperationConfig, "scopeKey">;

function queryKey({
  account,
  owner,
  chainId,
  apikey,
  address,
  abi,
  functionName,
  args,
  value,
  isPaymaster = true,
}: QueryKeyArgs & QueryKeyConfig) {
  return [
    {
      entity: "prepareUserOperation",
      account,
      owner,
      chainId,
      apikey,
      address,
      abi,
      functionName,
      args,
      value,
      isPaymaster,
    },
  ] as const;
}

function queryFn({
  queryKey: [
    {
      account,
      owner,
      chainId,
      apikey,
      address,
      value,
      isPaymaster,
      abi,
      functionName,
      args,
    },
  ],
}: QueryFunctionArgs<typeof queryKey>) {
  if (account === undefined) {
    throw new Error('account is required, leave "" for account creation');
  }
  if (!chainId) {
    throw new Error("chainId is required");
  }
  if (!apikey) {
    throw new Error("api key is required");
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

  const callValue = value || "0";
  return getUnsignedUserOperation({
    account,
    owner,
    chainId,
    apikey,
    address,
    value: callValue,
    abi,
    functionName,
    args,
    isPaymaster,
  });
}

export function usePrepareUserOperation({
  account,
  owner,
  chainId,
  address,
  value,
  abi,
  functionName,
  args,
  isPaymaster,
}: UsePrepareUserOperationArgs) {
  const config = useConfig();
  const { chain } = useNetwork();
  const { address: ownerAddress } = useAccount();
  const apikey = config.apikey;

  const queryKey_ = React.useMemo(
    () =>
      queryKey({
        account,
        owner: owner || ownerAddress,
        chainId: chainId || chain?.id,
        apikey: apikey,
        address,
        value,
        abi,
        functionName,
        args,
        isPaymaster,
      }),
    [
      account,
      owner,
      chainId,
      apikey,
      address,
      value,
      abi,
      functionName,
      args,
      isPaymaster,
      chain,
      ownerAddress,
    ]
  );

  const smartAccountsQuery = useQuery(queryKey_, queryFn, {});
  return smartAccountsQuery;
}
