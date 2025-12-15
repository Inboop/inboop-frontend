'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToastStore, Toast, ToastType } from '@/stores/useToastStore';

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
};

const toastStyles: Record<ToastType, string> = {
  success: 'border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
  error: 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/30',
  info: 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/30',
  warning: 'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/30',
};

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 200);
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border bg-card p-4 shadow-lg transition-all duration-200',
        toastStyles[toast.type],
        isExiting ? 'animate-slide-out-right opacity-0' : 'animate-slide-in-right'
      )}
    >
      <div className="flex-shrink-0">{toastIcons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{toast.title}</p>
        {toast.description && (
          <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p>
        )}
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}