interface ProgressBarProps {
  value: number;
}

export const ProgressBar = ({ value }: ProgressBarProps) => (
  <div className="w-full rounded-full bg-slate-200">
    <div
      className="h-3 rounded-full bg-success"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  </div>
);
