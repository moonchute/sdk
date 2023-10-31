import * as React from "react";
import {
  GetUnsignedUserOperationArgs,
  GetUnsignedUserOperationResult,
  getUnsignedUserOperation,
} from "../actions/getUnsignedUserOpearation";
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
  to,
  value,
  data,
  isPaymaster = true,
}: QueryKeyArgs & QueryKeyConfig) {
  return [
    {
      entity: "prepareUserOperation",
      account,
      owner,
      chainId,
      apikey,
      to,
      value,
      data,
      isPaymaster,
    },
  ] as const;
}

function queryFn({
  queryKey: [{ account, owner, chainId, apikey, to, value, data, isPaymaster }],
}: QueryFunctionArgs<typeof queryKey>) {
  if (!chainId) {
    throw new Error("ChainId is required");
  }
  if (!apikey) {
    throw new Error("API key is required");
  }
  if (!to) {
    throw new Error("To is required");
  }
  if (!data) {
    throw new Error("Data is required");
  }
  const txValue = value || "0";
  return getUnsignedUserOperation({
    account,
    owner,
    chainId,
    apikey,
    to,
    value: txValue,
    data,
    isPaymaster,
  });
}

export function usePrepareUserOperation({
  account,
  owner,
  chainId,
  to,
  value,
  data,
  isPaymaster,
}: UsePrepareUserOperationArgs) {
  const config = useConfig();
  const apikey = config.apikey;

  const queryKey_ = React.useMemo(
    () =>
      queryKey({
        account,
        owner,
        chainId,
        apikey: apikey,
        to,
        value,
        data,
        isPaymaster,
      }),
    [account, owner, chainId, apikey, to, value, data, isPaymaster]
  );

  const smartAccountsQuery = useQuery(queryKey_, queryFn, {});
  return smartAccountsQuery;

  // const {
  //   data: userop,
  //   error,
  //   isError,
  //   isIdle,
  //   isLoading,
  //   isSuccess,
  //   mutate,
  //   mutateAsync,
  //   reset,
  //   status,
  //   variables,
  // } = useMutation(
  //   mutationKey({
  //     account,
  //     owner,
  //     chainId,
  //     apikey: apikey,
  //     to,
  //     value,
  //     data,
  //     isPaymaster,
  //   }),
  //   mutationFn,
  //   {}
  // );

  // const write = React.useMemo(() => {
  //   return () => {};
  // }, [account, owner, chainId, to, value, data]);

  // return {
  //   data: userop,
  //   error,
  //   isError,
  //   isIdle,
  //   isLoading,
  //   isSuccess,
  //   mutate,
  //   mutateAsync,
  //   reset,
  //   status,
  //   variables,
  //   write,
  // };
}
