import React, { useState, useEffect } from 'react';
import { ActivityLog } from '../hooks/useWebSocket';
import { useCursor } from '../context/CursorContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  log: ActivityLog;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ log, onClose }) => {
  const { setCursorType } = useCursor();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(log.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [log.id, onClose]);

  const getStyle = () => {
    switch (log.type) {
      case 'success':
        return {
          icon: <CheckCircle2 size={16} className="text-emerald-500" />,
          border: 'border-emerald-100',
          bg: 'bg-emerald-50/95',
          text: 'text-emerald-900',
        };
      case 'warning':
        return {
          icon: <AlertCircle size={16} className="text-amber-500" />,
          border: 'border-amber-100',
          bg: 'bg-amber-50/95',
          text: 'text-amber-900',
        };
      case 'error':
        return {
          icon: <AlertCircle size={16} className="text-rose-500" />,
          border: 'border-rose-100',
          bg: 'bg-rose-50/95',
          text: 'text-rose-900',
        };
      case 'info':
      default:
        return {
          icon: <Info size={16} className="text-indigo-500" />,
          border: 'border-indigo-100',
          bg: 'bg-indigo-50/95',
          text: 'text-indigo-900',
        };
    }
  };

  const style = getStyle();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`flex items-start gap-3 w-80 p-4 rounded-xl border shadow-md backdrop-blur-md ${style.bg} ${style.border} ${style.text}`}
    >
      <div className="mt-0.5">{style.icon}</div>
      <div className="flex-1">
        <p className="text-xs font-semibold">{log.message}</p>
        <span className="text-[10px] text-slate-400 mt-1 block">{log.timestamp}</span>
      </div>
      <button
        onClick={() => onClose(log.id)}
        onMouseEnter={() => setCursorType('hover')}
        onMouseLeave={() => setCursorType('default')}
        className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition-colors"
      >
        <X size={12} />
      </button>
    </motion.div>
  );
};

interface NotificationToastProps {
  logs: ActivityLog[];
  registerListener: (callback: (log: ActivityLog) => void) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ registerListener }) => {
  const [activeToasts, setActiveToasts] = useState<ActivityLog[]>([]);

  // Intercept new logs to trigger floating notifications
  useEffect(() => {
    registerListener((newLog) => {
      setActiveToasts((prev) => [newLog, ...prev].slice(0, 4));
    });
  }, [registerListener]);

  const removeToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 max-w-sm">
      <AnimatePresence mode="popLayout">
        {activeToasts.map((toast) => (
          <Toast key={toast.id} log={toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
