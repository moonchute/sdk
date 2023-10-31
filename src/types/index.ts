import type {
  QueryFunctionContext,
  UseQueryOptions,
} from "@tanstack/react-query";

export type QueryConfig<TData, TError, TSelectData = TData> = Pick<
  UseQueryOptions<TData, TError, TSelectData>,
  | "cacheTime"
  | "enabled"
  | "isDataEqual"
  | "staleTime"
  | "structuralSharing"
  | "suspense"
  | "onError"
  | "onSettled"
  | "onSuccess"
> & {
  /** Scope the cache to a given context. */
  scopeKey?: string;
};

export type QueryFunctionArgs<T extends (...args: any) => any> =
  QueryFunctionContext<ReturnType<T>>;
export type userOperationType = {
  sender: `0x${string}`;
  nonce: bigint | string;
  initCode: `0x${string}`;
  callData: `0x${string}`;
  callGasLimit: bigint | string;
  verificationGasLimit: bigint | string;
  preVerificationGas: bigint | string;
  maxFeePerGas: bigint | string;
  maxPriorityFeePerGas: bigint | string;
  paymasterAndData: `0x${string}`;
  signature: `0x${string}`;
};
