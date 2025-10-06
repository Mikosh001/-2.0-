import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = ({ variant = 'primary', className, children, ...rest }: Props) => {
  const base = 'px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2';
  const styles = {
    primary: 'bg-primary text-white hover:bg-blue-600 focus:ring-primary',
    secondary: 'bg-success text-white hover:bg-green-600 focus:ring-success',
    ghost: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 focus:ring-primary',
  };
  return (
    <button className={clsx(base, styles[variant], className)} {...rest}>
      {children}
    </button>
  );
};
