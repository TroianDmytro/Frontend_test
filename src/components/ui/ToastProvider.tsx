import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

interface Toast { id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string; timeout?: number; }
interface ToastContextValue { push: (t: Omit<Toast, 'id'>) => void; }

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Toast[]>([]);

  const remove = (id: string) => setItems(prev => prev.filter(t => t.id !== id));

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = { id, timeout: 4000, ...t };
    setItems(prev => [...prev, toast]);
    if (toast.timeout) setTimeout(() => remove(id), toast.timeout);
  }, []);

  const icon = (type: Toast['type']) => {
    const cls = 'w-5 h-5';
    switch (type) {
      case 'success': return <CheckCircle2 className={cls + ' text-green-400'} />;
      case 'error': return <XCircle className={cls + ' text-red-400'} />;
      case 'warning': return <AlertTriangle className={cls + ' text-yellow-400'} />;
      default: return <Info className={cls + ' text-blue-400'} />;
    }
  };

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed z-50 bottom-4 right-4 flex flex-col gap-3 w-80">
        {items.map(t => (
          <div key={t.id} className="flex items-start gap-3 p-4 rounded bg-gray-900 border border-gray-700 shadow-md animate-fade-in">
            {icon(t.type)}
            <div className="text-sm text-gray-200 flex-1">{t.message}</div>
            <button className="text-gray-500 hover:text-white text-xs" onClick={() => remove(t.id)}>✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
