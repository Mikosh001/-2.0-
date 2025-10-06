import './BadgePill.css';

interface BadgePillProps {
  label: string;
  level?: 'Standard' | 'Advanced';
}

export const BadgePill = ({ label, level = 'Standard' }: BadgePillProps) => {
  return <span className={`badge-pill badge-${level.toLowerCase()}`}>{label}</span>;
};
