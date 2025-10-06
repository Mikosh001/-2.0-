import { ReactNode } from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Жабу">
            ×
          </Button>
        </div>
        <div className="mt-4 text-sm text-slate-600">{children}</div>
      </div>
    </div>
  );
};
