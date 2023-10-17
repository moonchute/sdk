import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import type { Config } from "./config";

export const Context = React.createContext<Config | undefined>(undefined);

export const queryClientContext = React.createContext<QueryClient | undefined>(
  undefined
);

export type ChuteConfigProps = {
  config: Config & { queryClient: QueryClient };
};

export function MoonChuteConfig({
  children,
  config,
}: React.PropsWithChildren<ChuteConfigProps>) {
  return React.createElement(Context.Provider, {
    value: config,
    children: React.createElement(QueryClientProvider, {
      children,
      client: config.queryClient,
      context: queryClientContext,
    }),
  });
}

export function useConfig() {
  const config = React.useContext(Context) as Config;
  if (!config) {
    throw new Error("useConfig must be used within a ChuteConfig");
  }
  return config;
}
