import * as React from "react";
import { useAccount, useNetwork } from "wagmi";
import {
  CreateSmartAccountArgs,
  CreateSmartAccountResult,
  createSmartAccount,
} from "../actions/createSmartAccount";
import { useConfig } from "../context";
import { useMutation } from "./query";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type UseCreateSmartAccountArgs = Partial<
  WithOptional<CreateSmartAccountArgs, "apikey"> | undefined
>;

export type UseCreateSmartAccountConfig = Partial<CreateSmartAccountArgs>;

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
      abi,
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
    abi,
    functionName,
    args,
    apikey,
  });
}

export function useCreateSmartAccount(config: UseCreateSmartAccountConfig) {
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
      ...(config as UseCreateSmartAccountArgs),
      apikey,
      owner: ownerAddress,
      chainId: chain?.id,
    }),
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
        abi,
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
