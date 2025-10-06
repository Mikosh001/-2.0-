interface BadgePillProps {
  label: string;
  level?: string;
}

export const BadgePill = ({ label, level }: BadgePillProps) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
    {label}
    {level && <span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-primary">{level}</span>}
  </span>
);
