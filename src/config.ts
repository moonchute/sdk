import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import type { Persister } from "@tanstack/react-query-persist-client";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { persist, subscribeWithSelector } from "zustand/middleware";
import type { Mutate, StoreApi } from "zustand/vanilla";
import { createStore } from "zustand/vanilla";
import type { ClientStorage } from "./storage";
import { createStorage, noopStorage } from "./storage";

export type CreateConfigParameters = {
  queryClient?: QueryClient;
  persister?: Persister;
  storage?: ClientStorage;
};

export type Data = {};

export type State = {
  data?: Data;
  error?: Error;
  status: "idle" | "loading" | "success" | "error";
};

const storeKey = "store";

export class Config {
  storage: ClientStorage;
  store: Mutate<
    StoreApi<State>,
    [
      ["zustand/subscribeWithSelector", never],
      ["zustand/persist", Partial<State>]
    ]
  >;

  constructor({
    storage = createStorage({
      storage:
        typeof window !== "undefined" ? window.localStorage : noopStorage,
    }),
  }: {
    storage?: ClientStorage;
  }) {
    this.storage = storage;
    let status: State["status"] = "success";

    this.store = createStore<
      State,
      [
        ["zustand/subscribeWithSelector", never],
        ["zustand/persist", Partial<State>]
      ]
    >(
      subscribeWithSelector(
        persist(
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          () => <State>{ status },
          {
            name: storeKey,
            storage,
            partialize: (state) => ({
              status: state.status,
            }),
            version: 2,
          }
        )
      )
    );
  }
}

export type ConfigWithQueryClient = Config & { queryClient: QueryClient };

export function createConfig({
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1_000 * 60 * 60 * 24, // 24 hours
        networkMode: "offlineFirst",
        refetchOnWindowFocus: false,
        retry: 0,
      },
      mutations: {
        networkMode: "offlineFirst",
      },
    },
  }),
  storage = createStorage({
    storage:
      typeof window !== "undefined" && window.localStorage
        ? window.localStorage
        : noopStorage,
  }),
  persister = typeof window !== "undefined"
    ? createSyncStoragePersister({
        key: "cache",
        serialize: (x: any) => x,
        deserialize: (x: any) => x,
        storage,
      })
    : undefined,
  ...args
}: CreateConfigParameters) {
  const config = new Config({ ...args, storage });
  if (persister) {
    persistQueryClient({
      queryClient,
      persister,
      dehydrateOptions: {
        shouldDehydrateQuery: (query) =>
          query.cacheTime !== 0 &&
          (query.queryKey[0] as { persist?: boolean }).persist !== false,
      },
    });
  }
  return Object.assign(config, { queryClient });
}
