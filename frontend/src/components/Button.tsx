import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({ children, variant = 'primary', ...rest }: PropsWithChildren<ButtonProps>) => {
  return (
    <button className={`btn btn-${variant}`} {...rest}>
      {children}
    </button>
  );
};
