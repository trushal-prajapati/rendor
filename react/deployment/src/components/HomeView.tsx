import React from 'react';
import { useCursor } from '../context/CursorContext';
import { ClinicMetrics } from '../hooks/useWebSocket';
import { Sparkles, Heart, Shield, Award, Users, ArrowRight, DollarSign, Calendar } from 'lucide-react';

interface HomeViewProps {
  metrics: ClinicMetrics;
  onNavigate: (tab: string, theme: any) => void;
}

interface ServiceItem {
  name: string;
  desc: string;
  price: string;
  badge: string;
  icon: string;
}

const SERVICES: ServiceItem[] = [
  { name: 'Laser Skin Resurfacing', desc: 'Minimizes hyperpigmentation, redness, and deep scarring.', price: '$120.00', badge: 'Popular', icon: '⚡' },
  { name: 'Acne Clarifying Peel', desc: 'Salicylic acid compound formula to regulate sebum levels.', price: '$85.00', badge: 'Clinical', icon: '🧪' },
  { name: 'Botox & Microneedling', desc: 'Stimulates natural collagen release and smooths wrinkles.', price: '$190.00', badge: 'Therapy', icon: '💉' },
];

export const HomeView: React.FC<HomeViewProps> = ({ metrics, onNavigate }) => {
  const { setCursorType, setCursorLabel } = useCursor();

  const handleMouseEnter = (label: string) => {
    setCursorType('hover');
    setCursorLabel(label);
  };

  const handleMouseLeave = () => {
    setCursorType('default');
    setCursorLabel(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-4 space-y-8 relative">
      
      {/* 1. Hero Welcome Card */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-5 text-left max-w-xl">
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <Sparkles size={10} />
            Dermatological Excellence
          </span>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Advanced Skin Therapy <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Tailored For Your Identity
            </span>
          </h1>

          <p className="text-slate-500 text-sm leading-relaxed">
            RenderSkin delivers medical-grade dermatological procedures. From acne clarifying formulations to precision laser treatments, schedule your video consult today.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('booking', 'booking')}
              onMouseEnter={() => handleMouseEnter('Book Slot')}
              onMouseLeave={handleMouseLeave}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-none"
            >
              Book Session
              <ArrowRight size={13} />
            </button>
            
            <button
              onClick={() => onNavigate('registration', 'registration')}
              onMouseEnter={() => handleMouseEnter('Create Chart')}
              onMouseLeave={handleMouseLeave}
              className="px-5 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all cursor-none"
            >
              Register Patient file
            </button>

            <button
              onClick={() => onNavigate('consultation', 'consultation')}
              onMouseEnter={() => handleMouseEnter('View Appointments')}
              onMouseLeave={handleMouseLeave}
              className="px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-md shadow-violet-600/10 transition-all flex items-center gap-1.5 cursor-none"
            >
              <Calendar size={13} />
              My Appointments
            </button>
          </div>
        </div>

        {/* Hero visual metrics showcase */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-80 shrink-0">
          <div className="glass-panel p-4 rounded-2xl border border-slate-100/50 flex flex-col justify-between h-28 bg-white/40">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Patient Queue</span>
            <h2 className="text-2xl font-extrabold text-slate-800">{metrics.activePatientsOnline} Online</h2>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-100/50 flex flex-col justify-between h-28 bg-white/40">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Booked Sessions</span>
            <h2 className="text-2xl font-extrabold text-slate-800">{metrics.appointmentsBookedToday} Today</h2>
            <span className="text-[8px] text-indigo-500 font-semibold uppercase">PostgreSQL Sync</span>
          </div>
        </div>
      </div>

      {/* 2. Core Services Grid */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
          <Award size={18} className="text-emerald-600" />
          Clinical Dermatological Procedures
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.name}
              onMouseEnter={() => handleMouseEnter(`Explore ${s.name}`)}
              onMouseLeave={handleMouseLeave}
              className="glass-panel p-6 rounded-2xl border border-white/20 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between h-52 group relative"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-2xl p-2 bg-emerald-50/50 rounded-xl">{s.icon}</span>
                  <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase">
                    {s.badge}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-800 mt-4 group-hover:text-emerald-700 transition-colors text-sm">
                  {s.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100/60">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Starting from</span>
                <span className="text-sm font-extrabold text-slate-800 flex items-center">
                  <DollarSign size={13} className="text-emerald-600" />
                  {s.price.replace('$', '')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Clinical Values Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-start gap-4 bg-white/40">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><Heart size={18} /></div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">HIPAA Secure Portal</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
              Patient chart uploads, prescriptions, and consult logs are secured under clinical transport privacy guidelines.
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-start gap-4 bg-white/40">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><Shield size={18} /></div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Certified Derm Specialists</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
              Our board-certified dermatologists bring surgical and clinical skin diagnosis expertise directly to your web consult.
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-start gap-4 bg-white/40">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><Users size={18} /></div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Dynamic Real-Time Calendars</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
              Time slot statuses, availability locks, and appointment validations synchronize live to prevent overlapped bookings.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
