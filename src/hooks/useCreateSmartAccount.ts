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
  "abi" | "address" | "functionName" | "apikey" | "chainId" | "owner"
> &
  Partial<GetFunctionArgs<TAbi, TFunctionName>>;

export type UseCreateSmartAccountConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string
> = Omit<UseCreateSmartAccountArgs<TAbi, TFunctionName>, "abi"> & {
  abi: TAbi;
};
type MutationFn<TReturnType> = (() => TReturnType) | undefined;

function mutationKey({ ...config }: UseCreateSmartAccountArgs) {
  const { owner, chainId, apikey, address, value, abi, functionName, args } =
    config;

  return [
    {
      entity: "createSmartAccount",
      owner: owner,
      chainId: chainId,
      apikey,
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
  const { owner, chainId, apikey, address, value, abi, functionName, args } =
    config;

  if (!owner) {
    throw new Error("Owner is required");
  }
  if (!chainId) {
    throw new Error("ChainId is required");
  }
  if (!apikey) {
    throw new Error("API key is required");
  }
  if (!address) {
    throw new Error("Address is required");
  }
  if (!abi) {
    throw new Error("ABI is required");
  }
  if (!functionName) {
    throw new Error("Function name is required");
  }
  return createSmartAccount({
    owner,
    chainId,
    address,
    value,
    abi: abi as Abi,
    functionName,
    args,
    apikey,
  });
}

export function useCreateSmartAccount<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string
>(config: UseCreateSmartAccountConfig<TAbi, TFunctionName>) {
  const moonchuteConfig = useConfig();
  const apikey = moonchuteConfig.store.getState().apikey;
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
      apikey,
      owner: ownerAddress,
      chainId: chain?.id,
    } as UseCreateSmartAccountArgs),
    mutationFn,
    {}
  );

  const write = React.useMemo(() => {
    if (!config) return undefined;
    const { address, value, abi, functionName, args } = config;

    if (!ownerAddress || !chain || !address || !abi || !functionName || !apikey)
      return undefined;

    return () =>
      mutate({
        owner: ownerAddress,
        chainId: chain?.id,
        apikey,
        address,
        value,
        abi: abi as Abi,
        functionName,
        args,
      });
  }, [
    config,
    mutate,
    apikey,
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
