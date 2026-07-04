const memory = new Map<string, string>();

export function storageGet(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}

export function storageSet(key: string, value: string): void {
  memory.set(key, value);
  try {
    globalThis.localStorage?.setItem(key, value);
  } catch {
    // A memory fallback keeps the current session usable in restricted contexts.
  }
}

export function storageRemove(key: string): void {
  memory.delete(key);
  try {
    globalThis.localStorage?.removeItem(key);
  } catch {
    // Ignore storage restrictions.
  }
}
