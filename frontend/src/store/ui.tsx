import { createContext, useContext, useMemo, useState } from 'react';

interface UIContextValue {
  toast: string | null;
  showToast: (message: string) => void;
  clearToast: () => void;
}

const UIContext = createContext<UIContextValue | undefined>(undefined);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const clearToast = () => setToast(null);

  const value = useMemo(() => ({ toast, showToast, clearToast }), [toast]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('UIProvider жоқ');
  return ctx;
};
