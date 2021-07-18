import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [data, setStoredData] = useState<T>(initialValue);

  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((res) => (res ? JSON.parse(res) : initialValue))
      .then(setStoredData)
      .catch((err) => console.log("Error: ", err));
  }, [key, initialValue]);

  const setData = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(data) : value;
    setStoredData(valueToStore);
    AsyncStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [data, setData] as const;
}
