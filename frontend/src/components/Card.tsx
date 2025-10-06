import { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

const Card = ({ title, subtitle, actions, children }: CardProps) => (
  <article className="card" role="group">
    {title && (
      <header className="card-header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="card-actions">{actions}</div>}
      </header>
    )}
    <div className="card-body">{children}</div>
  </article>
);

export default Card;
