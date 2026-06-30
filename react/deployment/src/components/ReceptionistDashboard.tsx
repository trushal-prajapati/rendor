import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Calendar, CheckCircle, Clock, LogOut, RefreshCw, Search, User, XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Appointment } from '../api/types';
import { useAuth } from '../context/AuthContext';

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  COMPLETED: 'bg-sky-50 text-sky-700 border-sky-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

export const ReceptionistDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('ALL');

  const { data: appointments = [], isLoading, refetch } = useQuery({
    queryKey: ['receptionist-appointments'],
    queryFn: api.getReceptionistAppointments,
    refetchInterval: 10000,
  });

  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: api.getMetrics,
    refetchInterval: 15000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.updateAppointmentStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['receptionist-appointments'] }),
  });

  const filtered = appointments.filter((a: Appointment) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      a.patientCode.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#fafcfb]">
      <header className="sticky top-0 z-40 glass-panel border-b border-white/40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Reception Desk</p>
            <h1 className="text-lg font-extrabold text-slate-800">Appointment Management</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:block">{user?.fullName}</span>
            <button onClick={() => refetch()} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200">
              <RefreshCw size={14} className="text-slate-600" />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Today Booked', value: metrics?.appointmentsBookedToday ?? 0, icon: Calendar, color: 'text-sky-600' },
            { label: 'Pending', value: metrics?.pendingAppointments ?? 0, icon: Clock, color: 'text-amber-600' },
            { label: 'Total Patients', value: metrics?.totalPatients ?? 0, icon: User, color: 'text-emerald-600' },
            { label: 'Doctors', value: metrics?.availableDoctorsCount ?? 0, icon: CheckCircle, color: 'text-violet-600' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-4">
              <stat.icon size={16} className={`${stat.color} mb-2`} />
              <p className="text-2xl font-extrabold text-slate-800">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient, doctor, or ID..."
                className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    filter === s ? 'bg-sky-600 text-white' : 'bg-slate-50 text-slate-500 border border-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading appointments...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">No appointments found</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((appt: Appointment, i: number) => (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass-card rounded-xl p-4 flex flex-col lg:flex-row lg:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-800">{appt.patientName}</span>
                      <span className="text-[10px] font-mono text-slate-400">{appt.patientCode}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusColors[appt.status]}`}>
                        {appt.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{appt.patientEmail}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      <span className="font-semibold">{appt.doctorName}</span> · {appt.doctorSpecialty}
                    </p>
                  </div>

                  <div className="text-xs text-slate-600 shrink-0">
                    <p className="font-bold">{appt.appointmentDate}</p>
                    <p className="text-sky-600 font-semibold">{appt.timeSlot}</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {appt.status === 'PENDING' && (
                      <button
                        onClick={() => statusMutation.mutate({ id: appt.id, status: 'CONFIRMED' })}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg flex items-center gap-1"
                      >
                        <CheckCircle size={12} /> Confirm
                      </button>
                    )}
                    {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
                      <button
                        onClick={() => statusMutation.mutate({ id: appt.id, status: 'COMPLETED' })}
                        className="px-3 py-1.5 bg-sky-600 text-white text-[10px] font-bold rounded-lg"
                      >
                        Complete
                      </button>
                    )}
                    {appt.status !== 'CANCELLED' && (
                      <button
                        onClick={() => statusMutation.mutate({ id: appt.id, status: 'CANCELLED' })}
                        className="px-3 py-1.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-lg border border-red-100 flex items-center gap-1"
                      >
                        <XCircle size={12} /> Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
