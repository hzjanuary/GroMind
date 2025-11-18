import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = ({ id, type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const isSuccess = type === 'success';
  const bgColor = isSuccess
    ? 'bg-green-500 dark:bg-green-600'
    : 'bg-red-500 dark:bg-red-600';
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-right max-w-sm`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="flex-1">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="shrink-0 hover:opacity-80 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={onClose}
        />
      ))}
    </div>
  );
};
