"use client";

import _ from "lodash";
import { useEffect, useState } from "react";

export default function useStorageState<T extends object>(
  key: string,
  initialData: T | null | undefined,
) {
  const [data, setData] = useState<T | null | undefined>(initialData);
  const storage = window?.localStorage;

  function getStorageData(): T | null {
    const data = storage.getItem(key) as string | null;
    if (_.isEmpty(data) || data == null) {
      return null;
    }

    try {
      return JSON.parse(data as string) as T;
    } catch (ex) {
      console.error("JSON PARSE ERROR", ex);
      return null;
    }
  }

  function setStorageData(item: T) {
    storage.setItem(key, JSON.stringify(item));
  }

  useEffect(() => {
    const storageData = getStorageData();
    if (storageData != null) {
      setData(storageData);
    }
  }, []);

  return [
    data,
    (data: T) => {
      setData(data);
      setStorageData(data);
    },
  ] as [T | null | undefined, (data: T) => void];
}
