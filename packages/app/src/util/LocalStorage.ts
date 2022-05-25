import { isSSR } from "./isSSR";

class InMemoryStorage implements Storage {
  private store: { [key: string]: string } = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  getItem(key: string): string | null {
    if (isSSR) return null;
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

const inMemoryStorage: typeof localStorage = new InMemoryStorage();

function isLocalStorageSupported(): boolean {
  try {
    const supported = "localStorage" in window && !!window.localStorage;
    if (supported) {
      const key = "__storage_test__";
      window.localStorage.setItem(key, key);
      window.localStorage.removeItem(key);
      return true;
    }
  } catch (e) {
    console.log("LocalStorage is not supported");
  }

  return false;
}

export const LocalStorage = isLocalStorageSupported()
  ? window.localStorage
  : inMemoryStorage;
