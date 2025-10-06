import { createContext, useContext, useState, type PropsWithChildren } from 'react';
import './Toast.css';

type ToastMessage = { id: number; text: string };

interface ToastContextValue {
  notify: (text: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ notify: () => undefined });

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const notify = (text: string) => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((message) => message.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {messages.map((message) => (
          <div key={message.id} className="toast-item">
            {message.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
