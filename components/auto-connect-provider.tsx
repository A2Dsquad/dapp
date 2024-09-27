"use client";

import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AUTO_CONNECT_LOCAL_STORAGE_KEY = "AptosWalletAutoConnect";

export interface AutoConnectContextState {
  autoConnect: boolean;
  setAutoConnect(autoConnect: boolean): void;
}

export const AutoConnectContext = createContext<AutoConnectContextState>(
  {} as AutoConnectContextState,
);

export function useAutoConnect(): AutoConnectContextState {
  return useContext(AutoConnectContext);
}

export const AutoConnectProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [autoConnect, setAutoConnect] = useState(false);

  useEffect(() => {
    // Wait until the app hydrates before populating `autoConnect` from local storage
    try {
      const isAutoConnect = localStorage.getItem(
        AUTO_CONNECT_LOCAL_STORAGE_KEY,
      );
      if (isAutoConnect) return setAutoConnect(JSON.parse(isAutoConnect));
    } catch (e) {
      if (typeof window !== "undefined") {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    try {
      if (autoConnect) {
        localStorage.setItem(
          AUTO_CONNECT_LOCAL_STORAGE_KEY,
          JSON.stringify(autoConnect),
        );
      } else {
        localStorage.removeItem(AUTO_CONNECT_LOCAL_STORAGE_KEY);
      }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      if (typeof window !== "undefined") {
        console.error(error);
      }
    }
  }, [autoConnect]);

  return (
    <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>
      {children}
    </AutoConnectContext.Provider>
  );
};