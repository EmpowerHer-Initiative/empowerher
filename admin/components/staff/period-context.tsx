"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "staff-period";

export const PERIODS = Array.from({ length: 10 }, (_, i) => i + 1);

type PeriodContextValue = {
  period: number;
  setPeriod: (period: number) => void;
};

const PeriodContext = createContext<PeriodContextValue | null>(null);

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => {
  const stored = Number(localStorage.getItem(STORAGE_KEY));
  return PERIODS.includes(stored) ? stored : 1;
};

export const PeriodProvider = ({ children }: { children: React.ReactNode }) => {
  const period = useSyncExternalStore(subscribe, getSnapshot, () => 1);

  const setPeriod = useCallback((value: number) => {
    localStorage.setItem(STORAGE_KEY, String(value));
    listeners.forEach((listener) => listener());
  }, []);

  return (
    <PeriodContext.Provider value={{ period, setPeriod }}>
      {children}
    </PeriodContext.Provider>
  );
};

export const usePeriod = () => {
  const context = useContext(PeriodContext);
  if (!context) {
    throw new Error("usePeriod must be used within a PeriodProvider");
  }
  return context;
};
