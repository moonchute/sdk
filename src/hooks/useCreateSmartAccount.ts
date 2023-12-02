import type { Abi } from "abitype";
import * as React from "react";
import type { GetFunctionArgs } from "viem";
import { useAccount, useNetwork } from "wagmi";
import {
  CreateSmartAccountConfig,
  CreateSmartAccountResult,
  createSmartAccount,
} from "../actions/createSmartAccount";
import { useConfig } from "../context";
import { useMutation } from "./query";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<TType, TKeys extends keyof TType> = Partial<Pick<TType, TKeys>> &
  Omit<TType, TKeys>;

type UseCreateSmartAccountArgs<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string
> = PartialBy<
  CreateSmartAccountConfig,
  "abi" | "address" | "functionName" | "appId" | "chainId" | "owner"
> &
  Partial<GetFunctionArgs<TAbi, TFunctionName>>;

export type UseCreateSmartAccountConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string
> = Omit<UseCreateSmartAccountArgs<TAbi, TFunctionName>, "abi"> & {
  abi?: TAbi;
};
type MutationFn<TReturnType> = (() => TReturnType) | undefined;

function mutationKey({ ...config }: UseCreateSmartAccountArgs) {
  const { owner, chainId, appId, address, value, abi, functionName, args } =
    config;

  return [
    {
      entity: "createSmartAccount",
      owner: owner,
      chainId: chainId,
      appId,
      address,
      value,
      abi: abi as Abi,
      functionName,
      args,
    },
  ] as const;
}

function mutationFn(config: UseCreateSmartAccountArgs) {
  if (!config) {
    throw new Error("Config is required");
  }
  const { owner, chainId, appId, address, value, abi, functionName, args } =
    config;

  if (!owner) {
    throw new Error("Owner is required");
  }
  if (!chainId) {
    throw new Error("ChainId is required");
  }
  if (!appId) {
    throw new Error("APP ID is required");
  }
  if (address) {
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
  }

  return createSmartAccount({
    owner,
    chainId,
    address,
    value,
    abi: abi as Abi,
    functionName,
    args,
    appId,
  });
}

export function useCreateSmartAccount<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string
>(config: UseCreateSmartAccountConfig<TAbi, TFunctionName>) {
  const moonchuteConfig = useConfig();
  const appId = moonchuteConfig.store.getState().appId;
  const { chain } = useNetwork();
  const { address: ownerAddress } = useAccount();

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
    mutationKey({
      ...config,
      appId,
      owner: ownerAddress,
      chainId: chain?.id,
    } as UseCreateSmartAccountArgs),
    mutationFn,
    {}
  );

  const write = React.useMemo(() => {
    if (!config) return undefined;
    const { address, value, abi, functionName, args } = config;

    if (!ownerAddress || !chain || !appId) return undefined;

    if (address) {
      if (!abi && !value) return undefined;
    }

    return () =>
      mutate({
        owner: ownerAddress,
        chainId: chain?.id,
        appId,
        address,
        value,
        abi: abi as Abi,
        functionName,
        args,
      });
  }, [
    config,
    mutate,
    appId,
    ownerAddress,
    chain,
  ]) as MutationFn<CreateSmartAccountResult>;

  return {
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
    write,
  };
}
