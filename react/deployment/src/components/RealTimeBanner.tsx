import React from 'react';
import { ConnectionStatus } from '../hooks/useWebSocket';
import { useCursor } from '../context/CursorContext';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RealTimeBannerProps {
  status: ConnectionStatus;
}

export const RealTimeBanner: React.FC<RealTimeBannerProps> = ({ status }) => {
  const { setCursorType, setCursorLabel } = useCursor();

  const handleMouseEnter = () => {
    setCursorType('hover');
    setCursorLabel(
      status === 'connected'
        ? 'WS ping: 24ms'
        : status === 'reconnecting'
        ? 'Trying to connect...'
        : 'Server unreachable'
    );
  };

  const handleMouseLeave = () => {
    setCursorType('default');
    setCursorLabel(null);
  };

  return (
    <div
      className="fixed bottom-6 left-6 z-40"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg border backdrop-blur-md ${
            status === 'connected'
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
              : status === 'reconnecting'
              ? 'bg-amber-50/80 border-amber-200 text-amber-800'
              : 'bg-rose-50/80 border-rose-200 text-rose-800'
          }`}
        >
          {status === 'connected' && (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <Wifi size={14} className="text-emerald-600" />
              <span className="text-xs font-semibold tracking-wide">Live Feed Active</span>
            </>
          )}

          {status === 'reconnecting' && (
            <>
              <RefreshCw size={14} className="animate-spin text-amber-600" />
              <span className="text-xs font-semibold tracking-wide">Reconnecting...</span>
            </>
          )}

          {status === 'disconnected' && (
            <>
              <WifiOff size={14} className="text-rose-600 animate-bounce" />
              <span className="text-xs font-semibold tracking-wide">Link Severed</span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
