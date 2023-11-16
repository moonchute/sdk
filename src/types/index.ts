import type {
  QueryFunctionContext,
  UseMutationOptions,
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

export type MutationConfig<Data, Error, Variables = void> = {
  /** Function fires if mutation encounters error */
  onError?: UseMutationOptions<Data, Error, Variables>["onError"];
  /**
   * Function fires before mutation function and is passed same variables mutation function would receive.
   * Value returned from this function will be passed to both onError and onSettled functions in event of a mutation failure.
   */
  onMutate?: UseMutationOptions<Data, Error, Variables>["onMutate"];
  /** Function fires when mutation is either successfully fetched or encounters error */
  onSettled?: UseMutationOptions<Data, Error, Variables>["onSettled"];
  /** Function fires when mutation is successful and will be passed the mutation's result */
  onSuccess?: UseMutationOptions<Data, Error, Variables>["onSuccess"];
};

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
