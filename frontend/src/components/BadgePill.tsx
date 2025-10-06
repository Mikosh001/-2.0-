import './BadgePill.css';

interface BadgePillProps {
  label: string;
  color?: 'blue' | 'green' | 'gold';
}

const BadgePill = ({ label, color = 'blue' }: BadgePillProps) => (
  <span className={`badge-pill badge-${color}`}>{label}</span>
);

export default BadgePill;
