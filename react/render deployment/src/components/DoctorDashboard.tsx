import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, ChevronRight, FileImage, Heart, LogOut, Mail, User, X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { PatientDetail } from '../api/types';
import { useAuth } from '../context/AuthContext';

export const DoctorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<PatientDetail | null>(null);

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['doctor-patients'],
    queryFn: api.getDoctorPatients,
    refetchInterval: 15000,
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['doctor-appointments'],
    queryFn: api.getDoctorAppointments,
    refetchInterval: 15000,
  });

  const openPatient = async (id: number) => {
    const detail = await api.getPatientDetail(id);
    setSelectedPatient(detail);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-[#fafcfb]">
      <header className="sticky top-0 z-40 glass-panel border-b border-white/40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">Clinical Portal</p>
            <h1 className="text-lg font-extrabold text-slate-800">Dr. {user?.fullName?.replace('Dr. ', '')}</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel rounded-2xl p-5">
            <h2 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-violet-600" />
              My Appointments ({appointments.length})
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {appointments.map((appt) => (
                <div key={appt.id} className="glass-card rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-800">{appt.patientName}</p>
                  <p className="text-[10px] text-slate-500">{appt.patientCode}</p>
                  <p className="text-[10px] text-violet-600 font-semibold mt-1">
                    {appt.appointmentDate} · {appt.timeSlot}
                  </p>
                </div>
              ))}
              {appointments.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No appointments yet</p>
              )}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5">
            <h2 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <User size={16} className="text-violet-600" />
              Patients ({patients.length})
            </h2>
            {isLoading ? (
              <p className="text-xs text-slate-400 text-center py-8">Loading...</p>
            ) : (
              <div className="space-y-2">
                {patients.map((patient: PatientDetail) => (
                  <button
                    key={patient.id}
                    onClick={() => openPatient(patient.id)}
                    className="w-full glass-card rounded-xl p-3 text-left hover:bg-white/90 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{patient.fullName}</p>
                      <p className="text-[10px] text-slate-500">{patient.patientCode} · {patient.skinType}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-violet-500" />
                  </button>
                ))}
                {patients.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No patients assigned</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedPatient ? (
              <motion.div
                key={selectedPatient.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-panel rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800">{selectedPatient.fullName}</h2>
                    <p className="text-xs text-slate-500 font-mono">{selectedPatient.patientCode}</p>
                  </div>
                  <button onClick={() => setSelectedPatient(null)} className="p-2 rounded-lg hover:bg-slate-100">
                    <X size={16} className="text-slate-400" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Profile</p>
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <p className="flex items-center gap-2"><Mail size={12} /> {selectedPatient.email}</p>
                      <p><span className="font-semibold">Age:</span> {selectedPatient.age}</p>
                      <p><span className="font-semibold">Skin Type:</span> {selectedPatient.skinType}</p>
                      <p><span className="font-semibold">Allergies:</span> {selectedPatient.allergies || 'None'}</p>
                    </div>
                  </div>
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                      <Heart size={10} /> Skin Concerns
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPatient.concerns.map((c) => (
                        <span key={c} className="px-2 py-1 bg-violet-50 text-violet-700 text-[10px] font-bold rounded-lg border border-violet-100">
                          {c}
                        </span>
                      ))}
                      {selectedPatient.concerns.length === 0 && (
                        <span className="text-xs text-slate-400">No concerns listed</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                    <FileImage size={16} className="text-violet-600" />
                    Uploaded Skin Photos (.jpg)
                  </h3>
                  {selectedPatient.files.length === 0 ? (
                    <p className="text-xs text-slate-400 glass-card rounded-xl p-6 text-center">No images uploaded yet</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {selectedPatient.files.map((file) => (
                        <div key={file.id} className="glass-card rounded-xl overflow-hidden">
                          {file.contentType.startsWith('image/') ? (
                            <img
                              src={api.fileUrl(file.downloadUrl)}
                              alt={file.originalName}
                              className="w-full h-40 object-cover bg-slate-100"
                            />
                          ) : (
                            <div className="w-full h-40 bg-slate-100 flex items-center justify-center">
                              <FileImage size={32} className="text-slate-300" />
                            </div>
                          )}
                          <div className="p-3">
                            <p className="text-xs font-bold text-slate-800 truncate">{file.originalName}</p>
                            <p className="text-[10px] text-slate-500">
                              {formatSize(file.fileSize)} · {new Date(file.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 mb-3">Appointment History</h3>
                  <div className="space-y-2">
                    {selectedPatient.appointments.map((appt) => (
                      <div key={appt.id} className="glass-card rounded-xl p-3 flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{appt.doctorName}</p>
                          <p className="text-[10px] text-slate-500">{appt.appointmentDate} · {appt.timeSlot}</p>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                          {appt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]"
              >
                <User size={48} className="text-slate-200 mb-4" />
                <h2 className="text-lg font-extrabold text-slate-600">Select a Patient</h2>
                <p className="text-sm text-slate-400 mt-2 max-w-sm">
                  View clinical profile, skin concerns, uploaded JPG scans, and appointment history.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
