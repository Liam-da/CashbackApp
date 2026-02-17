import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove efter 3 sekunder
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 left-4 right-4 z-[9999] space-y-2 sm:left-auto sm:right-4 sm:w-[360px]"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Card
          key={toast.id}
          className={`
            flex items-start gap-3 rounded-lg border-transparent px-4 py-3 shadow-lg
            animate-[slideIn_0.3s_ease-out] w-full
            ${toast.type === 'success' ? 'bg-green-600 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-600 text-white' : ''}
            ${toast.type === 'warning' ? 'bg-yellow-500 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-600 text-white' : ''}
          `}
          role="alert"
        >
          <span className="text-xl sm:text-2xl">
            {toast.type === 'success' && '✅'}
            {toast.type === 'error' && '❌'}
            {toast.type === 'warning' && '⚠️'}
            {toast.type === 'info' && 'ℹ️'}
          </span>
          <p className="flex-1 text-sm font-medium sm:text-base">{toast.message}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeToast(toast.id)}
            className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10 sm:h-8 sm:w-8"
            aria-label="Luk notifikation"
          >
            ×
          </Button>
        </Card>
      ))}
    </div>
  );
}
