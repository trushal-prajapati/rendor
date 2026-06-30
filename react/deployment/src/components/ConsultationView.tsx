import React, { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';
import { api } from '../api/client';
import type { Appointment } from '../api/types';
import {
  Video, FileText, Image as ImageIcon, Upload, Download, CheckCircle,
  ExternalLink, Calendar, Clock, History, Stethoscope,
} from 'lucide-react';

interface ConsultationViewProps {
  onTriggerLog: (type: 'info' | 'success' | 'warning' | 'error', msg: string) => void;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  COMPLETED: 'bg-sky-50 text-sky-700 border-sky-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

const HISTORY_FILTERS = ['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as const;

function isUpcoming(appt: Appointment): boolean {
  const today = new Date().toISOString().split('T')[0];
  return (
    (appt.status === 'CONFIRMED' || appt.status === 'PENDING') &&
    appt.appointmentDate >= today
  );
}

function filterAppointments(list: Appointment[], filter: string): Appointment[] {
  switch (filter) {
    case 'UPCOMING':
      return list.filter(isUpcoming);
    case 'COMPLETED':
      return list.filter((a) => a.status === 'COMPLETED');
    case 'CANCELLED':
      return list.filter((a) => a.status === 'CANCELLED');
    default:
      return list;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const ConsultationView: React.FC<ConsultationViewProps> = ({ onTriggerLog }) => {
  const { setCursorType, setCursorLabel } = useCursor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [historyFilter, setHistoryFilter] = useState<string>('ALL');

  const { data: appointments = [], isLoading: loadingAppointments } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: api.getMyAppointments,
    refetchInterval: 15000,
  });

  const { data: files = [] } = useQuery({
    queryKey: ['my-files'],
    queryFn: api.getMyFiles,
  });

  const upcoming = appointments.find(isUpcoming);
  const filteredHistory = filterAppointments(appointments, historyFilter);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onTriggerLog('error', 'Please upload a JPG or PNG image file.');
      return;
    }

    setUploadProgress(0);
    onTriggerLog('info', 'Uploading derm-photo to secure medical vault...');

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev !== null && prev < 90 ? prev + 15 : prev));
    }, 200);

    try {
      const uploaded = await api.uploadFile(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      onTriggerLog('success', `Skin photo uploaded: ${uploaded.originalName}`);
      queryClient.invalidateQueries({ queryKey: ['my-files'] });
      setTimeout(() => setUploadProgress(null), 400);
    } catch (err) {
      clearInterval(progressInterval);
      setUploadProgress(null);
      onTriggerLog('error', err instanceof Error ? err.message : 'Upload failed');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/20">
            <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 border border-violet-100 rounded-md uppercase tracking-wider">
              Telemedicine Portal
            </span>
            <h3 className="font-extrabold text-slate-800 text-lg mt-3">Active Consultations</h3>
            
            {upcoming ? (
              <div className="bg-violet-50/40 border border-violet-100/50 p-4 rounded-xl mt-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Dermatology Consult</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{upcoming.doctorName}</p>
                  </div>
                  <span className="text-[9px] font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded uppercase">
                    {upcoming.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                  <Video size={12} className="text-violet-600" />
                  <span>{upcoming.appointmentDate} · {upcoming.timeSlot}</span>
                </div>

                <button
                  onMouseEnter={() => handleMouseEnter('Launch Video Feed')}
                  onMouseLeave={handleMouseLeave}
                  className="w-full py-2.5 bg-violet-600 text-white rounded-lg text-xs font-bold shadow-md shadow-violet-600/10 hover:bg-violet-700 transition-all flex items-center justify-center gap-1.5"
                >
                  Join Video Consult
                  <ExternalLink size={11} />
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-4">No upcoming appointments. Book a session first.</p>
            )}
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/20">
            <h3 className="font-extrabold text-slate-800 text-xs flex items-center gap-2 mb-3">
              <ImageIcon size={14} className="text-violet-600" />
              Upload Skin Scans
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
              Add clear, close-up photos of rashes or mole concerns. Doctor reviews uploaded scans during active consults.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              className="hidden"
              onChange={handleFileUpload}
            />

            {uploadProgress !== null ? (
              <div className="space-y-2 py-2">
                <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                  <span>Uploading photo...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-violet-600 h-full transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={() => handleMouseEnter('Upload derm photo')}
                onMouseLeave={handleMouseLeave}
                className="w-full py-6 border border-dashed border-slate-200 hover:border-violet-300 rounded-xl bg-white/40 text-slate-500 hover:text-violet-600 transition-all flex flex-col items-center justify-center gap-1.5"
              >
                <Upload size={20} className="stroke-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Choose JPG File</span>
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Appointment History */}
          <div className="glass-panel p-6 rounded-3xl border border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <History size={16} className="text-violet-600" />
                My Appointment History
                <span className="text-[10px] font-bold text-slate-400">({appointments.length})</span>
              </h3>
              <div className="flex gap-1.5 flex-wrap">
                {HISTORY_FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setHistoryFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${
                      historyFilter === f
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-50 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {loadingAppointments ? (
              <p className="text-xs text-slate-400 text-center py-8">Loading your appointments...</p>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-10">
                <Calendar size={32} className="text-slate-200 mx-auto mb-3" />
                <p className="text-xs text-slate-400">No appointments in this category yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((appt, i) => (
                  <motion.div
                    key={appt.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="glass-card rounded-xl p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl border border-violet-100 shrink-0">
                          <Stethoscope size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs font-bold text-slate-800">{appt.doctorName}</p>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusColors[appt.status]}`}>
                              {appt.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{appt.doctorSpecialty}</p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-600 font-semibold">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} className="text-violet-500" />
                              {formatDate(appt.appointmentDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} className="text-violet-500" />
                              {appt.timeSlot}
                            </span>
                          </div>
                          {appt.notes && (
                            <p className="text-[10px] text-slate-400 mt-1.5 italic">{appt.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[9px] text-slate-400 font-semibold">Booked</p>
                        <p className="text-[10px] text-slate-500">
                          {new Date(appt.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/20 h-fit">
            <h3 className="font-extrabold text-slate-800 text-sm mb-4">Uploaded Medical Files</h3>
            <div className="space-y-2">
              {files.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No files uploaded yet</p>
              )}
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3.5 bg-white/40 border border-slate-100 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    {file.contentType.startsWith('image/') ? (
                      <img
                        src={api.fileUrl(file.downloadUrl)}
                        alt={file.originalName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <ImageIcon size={14} />
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{file.originalName}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5 block">{file.contentType} • {formatSize(file.fileSize)}</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 font-semibold">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/20 h-fit">
            <h3 className="font-extrabold text-slate-800 text-sm mb-4">Digital Prescription Cards</h3>
            
            <div className="flex items-center justify-between p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Tretinoin Cream 0.05% Formulation</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Refills: 2 • Prescribed by Dr. Sarah Jenkins</p>
                  <span className="text-[8px] font-bold text-emerald-600 bg-emerald-100/50 border border-emerald-200 px-2 py-0.5 rounded uppercase mt-2 inline-flex items-center gap-0.5">
                    <CheckCircle size={8} />
                    Validated Rx
                  </span>
                </div>
              </div>

              <button
                onClick={() => onTriggerLog('success', 'Prescription PDF downloaded successfully.')}
                onMouseEnter={() => handleMouseEnter('Download Rx PDF')}
                onMouseLeave={handleMouseLeave}
                className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-emerald-600 rounded-xl transition-all shadow-sm"
              >
                <Download size={15} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
