import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
  label?: string;
}

const ProgressBar = ({ value, label }: ProgressBarProps) => (
  <div className="progress-wrapper" aria-label={label ?? 'Прогресс'}>
    {label && <span className="progress-label">{label}</span>}
    <div className="progress-track">
      <div className="progress-value" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
    <span className="progress-percent">{Math.round(value)}%</span>
  </div>
);

export default ProgressBar;
