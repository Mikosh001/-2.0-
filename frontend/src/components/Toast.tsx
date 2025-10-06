import { useEffect } from 'react';
import './Toast.css';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Toast = ({ message, type = 'success', onClose }: ToastProps) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} role="status">
      {message}
    </div>
  );
};

export default Toast;
