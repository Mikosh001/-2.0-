import { createContext, useContext } from 'react';

export type ToastPayload = { message: string; type?: 'success' | 'error' } | null;

export const ToastContext = createContext<{
  toast: ToastPayload;
  setToast: (toast: ToastPayload) => void;
}>({
  toast: null,
  setToast: () => undefined,
});

export const useToast = () => useContext(ToastContext);
