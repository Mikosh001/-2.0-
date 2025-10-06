import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
}

export const ProgressBar = ({ value }: ProgressBarProps) => {
  return (
    <div className="progress" aria-label="Прогресс">
      <div className="progress-fill" style={{ width: `${Math.min(100, value)}%` }} />
      <span className="progress-text">{Math.round(value)}%</span>
    </div>
  );
};
