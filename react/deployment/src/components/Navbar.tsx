import React from 'react';
import { useCursor, PageTheme } from '../context/CursorContext';
import { Heart, UserCheck, Calendar, FileText, ShieldAlert, RefreshCw, Activity, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  wsStatus: 'connected' | 'reconnecting' | 'disconnected';
  onSimulateDisconnect: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  wsStatus,
  onSimulateDisconnect,
  onLogout,
}) => {
  const { setCursorType, setPageTheme, setCursorLabel } = useCursor();
  const { user } = useAuth();

  const navItems = [
    { id: 'home', label: 'Overview', theme: 'home' as PageTheme, icon: Heart },
    { id: 'registration', label: 'Onboarding', theme: 'registration' as PageTheme, icon: UserCheck },
    { id: 'booking', label: 'Appointments', theme: 'booking' as PageTheme, icon: Calendar },
    { id: 'consultation', label: 'Clinical Portal', theme: 'consultation' as PageTheme, icon: FileText },
  ];

  const handleTabChange = (itemId: string, theme: PageTheme) => {
    setCurrentTab(itemId);
    setPageTheme(theme);
  };

  const handleMouseEnter = (label: string) => {
    setCursorType('hover');
    setCursorLabel(label);
  };

  const handleMouseLeave = () => {
    setCursorType('default');
    setCursorLabel(null);
  };

  return (
    <nav className="sticky top-0 z-40 w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel px-6 py-3.5 rounded-2xl">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2 font-bold text-lg select-none"
          onMouseEnter={() => handleMouseEnter('Skin Clinic Home')}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleTabChange('home', 'home')}
        >
          <motion.div
            animate={{ rotate: wsStatus === 'connected' ? 0 : 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className={`p-1.5 rounded-lg text-white ${
              wsStatus === 'connected'
                ? 'bg-emerald-600'
                : wsStatus === 'reconnecting'
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
          >
            <Activity size={18} />
          </motion.div>
          <span className="bg-gradient-to-r from-slate-900 via-emerald-950 to-emerald-900 bg-clip-text text-transparent font-extrabold tracking-tight">
            Render<span className="text-emerald-600">Skin</span>
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id, item.theme)}
                onMouseEnter={() => handleMouseEnter(`Open ${item.label}`)}
                onMouseLeave={handleMouseLeave}
                onMouseDown={() => setCursorType('click')}
                onMouseUp={() => setCursorType('hover')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 cursor-none ${
                  isActive ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-emerald-50 border border-emerald-100/50 rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={16} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Action controls (Simulate socket disruptions) */}
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-[10px] font-semibold text-slate-500 hidden md:block">{user.fullName}</span>
          )}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 transition-all cursor-none"
          >
            <LogOut size={13} />
            Logout
          </button>
          <button
            onClick={onSimulateDisconnect}
            onMouseEnter={() =>
              handleMouseEnter(
                wsStatus === 'connected' ? 'Interrupt Sync' : 'Awaiting Connection...'
              )
            }
            onMouseLeave={handleMouseLeave}
            onMouseDown={() => setCursorType('click')}
            onMouseUp={() => setCursorType('hover')}
            disabled={wsStatus !== 'connected'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-none ${
              wsStatus === 'connected'
                ? 'bg-white hover:bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {wsStatus === 'connected' ? (
              <>
                <ShieldAlert size={13} />
                Break Link
              </>
            ) : (
              <>
                <RefreshCw size={13} className="animate-spin" />
                Fixing...
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
