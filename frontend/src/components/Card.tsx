import type { PropsWithChildren, ReactNode } from 'react';
import './Card.css';

interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export const Card = ({ title, subtitle, actions, children }: PropsWithChildren<CardProps>) => (
  <div className="card">
    {title && (
      <div className="card-header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="card-actions">{actions}</div>}
      </div>
    )}
    <div className="card-body">{children}</div>
  </div>
);
