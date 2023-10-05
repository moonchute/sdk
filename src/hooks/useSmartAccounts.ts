import * as React from "react";
import {
  FetchSmartAccountsArgs,
  FetchSmartAccountsResult,
  fetchSmartAccounts,
} from "../actions/fetchSmartAccounts";
import { useConfig } from "../context";
import type { QueryConfig, QueryFunctionArgs } from "../types";
import { useQuery } from "./query";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type UseSmartAccountsArgs = WithOptional<
  FetchSmartAccountsArgs,
  "apikey"
>;

export type UseSmartAccountsConfig = QueryConfig<
  FetchSmartAccountsResult,
  Error
>;

type QueryKeyArgs = FetchSmartAccountsArgs;
type QueryKeyConfig = Pick<UseSmartAccountsConfig, "scopeKey">;

function queryKey({ address, chainId, apikey }: QueryKeyArgs & QueryKeyConfig) {
  return [{ entity: "smartaccounts", address, chainId, apikey }] as const;
}

function queryFn({
  queryKey: [{ address, chainId, apikey }],
}: QueryFunctionArgs<typeof queryKey>) {
  return fetchSmartAccounts({ address, chainId, apikey });
}

export function useSmartAccounts({ address, chainId }: UseSmartAccountsArgs) {
  const config = useConfig();
  const apikey = config.apikey;

  const queryKey_ = React.useMemo(
    () => queryKey({ address, chainId, apikey: apikey }),
    [address, chainId, apikey]
  );

  const smartAccountsQuery = useQuery(queryKey_, queryFn, {});

  return smartAccountsQuery;
}
