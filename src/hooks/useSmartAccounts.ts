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
  "appId"
>;

export type UseSmartAccountsConfig = QueryConfig<
  FetchSmartAccountsResult,
  Error
>;

type QueryKeyArgs = FetchSmartAccountsArgs;
type QueryKeyConfig = Pick<UseSmartAccountsConfig, "scopeKey">;

function queryKey({ address, chainId, appId }: QueryKeyArgs & QueryKeyConfig) {
  return [{ entity: "smartaccounts", address, chainId, appId }] as const;
}

function queryFn({
  queryKey: [{ address, chainId, appId }],
}: QueryFunctionArgs<typeof queryKey>) {
  return fetchSmartAccounts({ address, chainId, appId });
}

export function useSmartAccounts({ address, chainId }: UseSmartAccountsArgs) {
  const config = useConfig();
  const appId = config.appId;

  const queryKey_ = React.useMemo(
    () => queryKey({ address, chainId, appId: appId }),
    [address, chainId, appId]
  );

  const smartAccountsQuery = useQuery(queryKey_, queryFn, {});

  return smartAccountsQuery;
}
