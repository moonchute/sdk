import * as React from "react";
import {
  WaitForUserOperationArgs,
  WaitForUserOperationResult,
  waitForUserOperation,
} from "../actions/waitForUserOperation";
import { useConfig } from "../context";
import type { QueryConfig, QueryFunctionArgs } from "../types";
import { useQuery } from "./query";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type UseWaitForUserOperationArgs = WithOptional<
  WaitForUserOperationArgs,
  "appId"
>;

export type UseWaitForUserOperationConfig = QueryConfig<
  WaitForUserOperationResult,
  Error
>;

type QueryKeyArgs = WaitForUserOperationArgs;
type QueryKeyConfig = Pick<UseWaitForUserOperationConfig, "scopeKey">;

function queryKey({
  userOpHash,
  chainId,
  appId,
}: QueryKeyArgs & QueryKeyConfig) {
  return [
    { entity: "wairForUserOperation", userOpHash, chainId, appId },
  ] as const;
}

function queryFn({
  queryKey: [{ userOpHash, chainId, appId }],
}: QueryFunctionArgs<typeof queryKey>) {
  if (!appId) {
    throw new Error("appId is required");
  }
  if (!chainId) {
    throw new Error("chainId is required");
  }
  if (!userOpHash) {
    throw new Error("userOp hash is required");
  }
  return waitForUserOperation({ userOpHash, chainId, appId });
}

export function useWaitForUserOperation({
  userOpHash,
  chainId,
}: UseWaitForUserOperationArgs) {
  const config = useConfig();
  const appId = config.appId;

  const queryKey_ = React.useMemo(
    () => queryKey({ userOpHash, chainId, appId: appId || "" }),
    [userOpHash, chainId, appId]
  );

  const waitForUserOperationReceiptQuery = useQuery(queryKey_, queryFn, {});

  return waitForUserOperationReceiptQuery;
}
