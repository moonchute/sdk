import { QueryClient } from "@tanstack/react-query";
import {
  renderHook as defaultRenderHook,
  waitFor,
  type RenderHookOptions,
} from "@testing-library/react";
import * as React from "react";
import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import type { ConfigWithQueryClient } from "../src/config";
import { MoonChuteConfig } from "../src/context";
import { setupConfig } from "./utils";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent Jest from garbage collecting cache
      cacheTime: Infinity,
      // Turn off retries to prevent timeouts
      retry: false,
    },
  },
  logger: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: () => {},
    log: console.log,
    warn: console.warn,
  },
});

type Props = { config?: ConfigWithQueryClient } & {
  children?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactNode;
};

export function wrapper({
  config = setupConfig({ queryClient, appId: "test" }),
  ...rest
}: Props = {}) {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet],
    [publicProvider()]
  );
  const wagmiconfig = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
  });
  return (
    <WagmiConfig config={wagmiconfig}>
      <MoonChuteConfig config={config} {...rest} />;
    </WagmiConfig>
  );
}

export function renderHook<TResult, TProps>(
  hook: (props: TProps) => TResult,
  {
    wrapper: wrapper_,
    ...options_
  }:
    | RenderHookOptions<TProps & { config?: ConfigWithQueryClient }>
    | undefined = {}
) {
  const options: RenderHookOptions<
    TProps & { config?: ConfigWithQueryClient }
  > = {
    ...(wrapper_
      ? { wrapper: wrapper_ }
      : {
          wrapper: (props) => wrapper({ ...props, ...options_.initialProps }),
        }),
    ...options_,
  };
  queryClient.clear();

  const utils = defaultRenderHook<TResult, TProps>(hook, options);
  return {
    ...utils,
    waitFor: (utils as { waitFor?: typeof waitFor })?.waitFor ?? waitFor,
  };
}
export { act, cleanup } from "@testing-library/react";
