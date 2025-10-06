import { ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const Button = ({ variant = 'primary', className, children, ...props }: ButtonProps) => (
  <button className={`btn btn-${variant} ${className ?? ''}`.trim()} {...props}>
    {children}
  </button>
);

export default Button;
