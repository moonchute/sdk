type BaseStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type ClientStorage = {
  getItem<T>(key: string, defaultState?: T | null): T | null;
  setItem<T>(key: string, value: T | null): void;
  removeItem(key: string): void;
};

export const noopStorage: BaseStorage = {
  getItem: (_key) => "",
  setItem: (_key, _value) => null,
  removeItem: (_key) => null,
};

export function createStorage({
  prefix = "chute",
  storage,
}: {
  prefix?: string;
  storage: BaseStorage;
}): ClientStorage {
  return {
    ...storage,
    getItem: (key, defaultState = null) => {
      const value = storage.getItem(`${prefix}.${key}`);
      return value === null ? defaultState : JSON.parse(value);
    },
    setItem: (key, value) => {
      if (value === null) {
        storage.removeItem(`${prefix}.${key}`);
      } else {
        storage.setItem(`${prefix}.${key}`, JSON.stringify(value));
      }
    },
    removeItem: (key) => storage.removeItem(`${prefix}.${key}`),
  };
}
