interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast = ({ message, onClose }: ToastProps) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="rounded-full bg-white/20 px-2 py-1 text-xs uppercase tracking-wide"
        >
          Жабу
        </button>
      </div>
    </div>
  );
};
