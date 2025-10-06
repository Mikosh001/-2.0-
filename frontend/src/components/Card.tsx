import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export const Card = ({ title, subtitle, children, className }: CardProps) => (
  <div className={clsx('rounded-2xl border border-slate-200 bg-white p-6 shadow-sm', className)}>
    {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
    {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    <div className={clsx(title ? 'mt-4' : '')}>{children}</div>
  </div>
);
