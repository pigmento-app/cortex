import { useEffect, useCallback, useReducer } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync<T>(key: string, value: T | null) {
  const stringValue = value !== null ? JSON.stringify(value) : null;
  if (Platform.OS === "web") {
    try {
      if (stringValue === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, stringValue);
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    if (stringValue == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, stringValue);
    }
  }
}

export function useStorageState<T>(
  key: string,
  initialValue: T | null = null
): UseStateHook<T> {
  const [state, setState] = useAsyncState<T>([true, initialValue]);

  useEffect(() => {
    const loadState = async () => {
      try {
        let storedValue: string | null = null;
        if (Platform.OS === "web") {
          storedValue = localStorage.getItem(key);
        } else {
          storedValue = await SecureStore.getItemAsync(key);
        }
        if (storedValue !== null) {
          setState(JSON.parse(storedValue));
        } else {
          setState(initialValue);
        }
      } catch (e) {
        console.error("Failed to load state from storage", e);
      }
    };

    loadState();
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
