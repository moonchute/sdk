import * as React from "react";
import { GetUnsignedUserOperationResult } from "../actions/getUnsignedUserOperation";
import {
  SendUserOperationArgs,
  SendUserOperationResult,
  sendUserOperation,
} from "../actions/sendUserOperation";
import { useConfig } from "../context";
import { useMutation } from "./query";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type UseSendUserOperationArgs = Partial<
  WithOptional<SendUserOperationArgs, "appId"> | undefined
>;

export type UseSendUserOperationConfig =
  Partial<GetUnsignedUserOperationResult>;

type MutationFn<TReturnType> = (() => TReturnType) | undefined;

function mutationKey({ ...config }: UseSendUserOperationArgs) {
  const { userOp, userOpHash, chainId, accountType, appId } = config;

  return [
    {
      entity: "sendUserOperation",
      userOp,
      userOpHash,
      chainId,
      accountType,
      appId,
    },
  ] as const;
}

function mutationFn(config: UseSendUserOperationArgs) {
  if (!config) {
    throw new Error("Config is required");
  }
  const { userOp, userOpHash, chainId, accountType, appId } = config;

  if (!chainId) {
    throw new Error("ChainId is required");
  }
  if (!accountType) {
    throw new Error("Account type is required");
  }
  if (!userOp) {
    throw new Error("User operation is required");
  }
  if (!userOpHash) {
    throw new Error("User operation hash is required");
  }
  if (!appId) {
    throw new Error("API key is required");
  }
  return sendUserOperation({
    userOp,
    userOpHash,
    chainId,
    accountType,
    appId,
  });
}

export function useSendUserOperation(config: UseSendUserOperationConfig) {
  const moonchuteConfig = useConfig();
  const appId = moonchuteConfig.store.getState().appId;

  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables,
  } = useMutation(
    mutationKey({ ...(config as UseSendUserOperationArgs), appId }),
    mutationFn,
    {}
  );

  const write = React.useMemo(() => {
    if (!config) return undefined;
    const { userOp, userOpHash, chainId, accountType } = config;
    if (!userOp || !userOpHash || !chainId || !accountType || !appId)
      return undefined;

    return () =>
      mutate({
        userOp,
        userOpHash,
        chainId,
        accountType,
        appId,
      });
  }, [config, mutate, appId]) as MutationFn<SendUserOperationResult>;

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    status,
    variables,
    write,
  };
}
