import type { PropsWithChildren, ReactNode } from 'react';
import './Modal.css';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  footer?: ReactNode;
}

export const Modal = ({ open, title, children, onClose, footer }: PropsWithChildren<ModalProps>) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <header className="modal-header">
          <h3>{title}</h3>
          <Button variant="secondary" onClick={onClose} aria-label="Жабу">
            ×
          </Button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-footer">{footer}</footer>}
      </div>
    </div>
  );
};
