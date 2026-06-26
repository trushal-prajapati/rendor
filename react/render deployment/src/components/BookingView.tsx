import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCursor } from '../context/CursorContext';
import { api } from '../api/client';
import { Calendar, UserCheck, Clock, Sparkles, RefreshCw } from 'lucide-react';
import { SkeletonCard } from './SkeletonCard';

interface BookingViewProps {
  onTriggerLog: (type: 'info' | 'success' | 'warning' | 'error', msg: string) => void;
  onCompleteBooking: () => void;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: string;
  image: string;
}

interface TimeSlot {
  id: string;
  time: string;
  status: 'available' | 'locking' | 'booked';
}

const INITIAL_SLOTS: TimeSlot[] = [
  { id: 'slot-1', time: '09:00 AM', status: 'booked' },
  { id: 'slot-2', time: '10:00 AM', status: 'available' },
  { id: 'slot-3', time: '10:30 AM', status: 'locking' }, // Simulated other user selection lock
  { id: 'slot-4', time: '11:00 AM', status: 'available' },
  { id: 'slot-5', time: '02:00 PM', status: 'available' },
  { id: 'slot-6', time: '03:00 PM', status: 'booked' },
  { id: 'slot-7', time: '04:00 PM', status: 'available' },
];

export const BookingView: React.FC<BookingViewProps> = ({
  onTriggerLog,
  onCompleteBooking,
}) => {
  const { setCursorType, setCursorLabel } = useCursor();
  const { data: apiDoctors = [] } = useQuery({ queryKey: ['doctors'], queryFn: api.getDoctors });
  const doctors: Doctor[] = apiDoctors.map((d, i) => ({
    id: d.id,
    name: d.name,
    specialty: d.specialty,
    rating: `${d.rating} rating`,
    image: i === 0 ? '👩‍⚕️' : '👨‍⚕️',
  }));
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>(INITIAL_SLOTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctors.length > 0 && selectedDoc === null) {
      setSelectedDoc(doctors[0].id);
    }
  }, [doctors, selectedDoc]);

  // Generate next 4 calendar days
  const days = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      index: i,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  // Fluctuate slot locks periodically to show real-time synchronization
  useEffect(() => {
    const timer = setInterval(() => {
      setSlots((prev) =>
        prev.map((s) => {
          if (s.id === 'slot-3') {
            // Toggle between locking and available
            const nextStatus = s.status === 'locking' ? 'available' : 'locking';
            if (nextStatus === 'locking') {
              onTriggerLog('warning', 'Dermatology slot 10:30 AM has been lock-secured by another client IP.');
            } else {
              onTriggerLog('info', 'Dermatology slot 10:30 AM released. Available for registration.');
            }
            return { ...s, status: nextStatus };
          }
          return s;
        })
      );
    }, 9000);

    return () => clearInterval(timer);
  }, [onTriggerLog]);

  const handleSelectSlot = (slotId: string, status: TimeSlot['status']) => {
    if (status === 'booked') {
      onTriggerLog('error', 'Time slot already reserved by another patient file.');
      return;
    }
    if (status === 'locking') {
      onTriggerLog('warning', 'Slot is currently being processed. Selection temporarily locked.');
      return;
    }
    setSelectedSlot(slotId);
    onTriggerLog('info', `Time slot ${slots.find((s) => s.id === slotId)?.time} selected. Awaiting consent.`);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedDoc) return;
    
    const targetSlot = slots.find((s) => s.id === selectedSlot);
    const targetDoc = doctors.find((d) => d.id === selectedDoc);
    if (!targetSlot || !targetDoc) return;

    setLoading(true);
    onTriggerLog('info', `Booking mutation dispatched. Confirming ${targetSlot.time} with ${targetDoc.name}...`);

    try {
      const bookDate = new Date();
      bookDate.setDate(bookDate.getDate() + selectedDate);

      await api.bookAppointment({
        doctorId: selectedDoc,
        appointmentDate: bookDate.toISOString().split('T')[0],
        timeSlot: targetSlot.time,
      });

      setSlots((prev) =>
        prev.map((s) => (s.id === selectedSlot ? { ...s, status: 'booked' } : s))
      );
      setSelectedSlot(null);
      onTriggerLog('success', `Appointment confirmed! ${targetDoc.name} on ${days[selectedDate].month} ${days[selectedDate].dateNum} at ${targetSlot.time}`);
      onCompleteBooking();
    } catch (err) {
      onTriggerLog('error', err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (label: string) => {
    setCursorType('hover');
    setCursorLabel(label);
  };

  const handleMouseLeave = () => {
    setCursorType('default');
    setCursorLabel(null);
  };

  const currentDoctor = doctors.find((d) => d.id === selectedDoc);

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Doctor List & Date selection */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Select Doctor */}
          <div className="glass-panel p-5 rounded-2xl border border-white/20">
            <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5">
              <UserCheck size={14} className="text-sky-500" />
              1. Choose Dermatologist
            </h3>
            <div className="space-y-2">
              {doctors.map((doc) => {
                const isSelected = selectedDoc === doc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    onMouseEnter={() => handleMouseEnter(`Select ${doc.name}`)}
                    onMouseLeave={handleMouseLeave}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-sky-50/60 border-sky-200 text-sky-950 font-semibold'
                        : 'bg-white/40 border-slate-100 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">{doc.image}</span>
                    <div>
                      <h4 className="text-xs font-bold">{doc.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{doc.specialty}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Date */}
          <div className="glass-panel p-5 rounded-2xl border border-white/20">
            <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5">
              <Calendar size={14} className="text-sky-500" />
              2. Select Appointment Date
            </h3>
            <div className="grid grid-cols-4 gap-1.5">
              {days.map((day) => {
                const isSelected = selectedDate === day.index;
                return (
                  <button
                    key={day.index}
                    onClick={() => setSelectedDate(day.index)}
                    onMouseEnter={() => handleMouseEnter(`${day.month} ${day.dateNum}`)}
                    onMouseLeave={handleMouseLeave}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-sky-500 border-sky-500 text-white font-semibold'
                        : 'bg-white/40 border-slate-100 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[9px] block uppercase tracking-wider opacity-80">{day.dayName}</span>
                    <span className="text-base font-extrabold block mt-0.5">{day.dateNum}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right column: Slots list & Confirmation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 h-full flex flex-col justify-between min-h-[380px]">
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-1.5">
                  <Clock size={14} className="text-sky-500" />
                  3. Select Session Time Slot ({currentDoctor?.name})
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot === slot.id;
                    const isBooked = slot.status === 'booked';
                    const isLocking = slot.status === 'locking';

                    return (
                      <button
                        key={slot.id}
                        onClick={() => handleSelectSlot(slot.id, slot.status)}
                        onMouseEnter={() =>
                          handleMouseEnter(
                            isBooked
                              ? 'Reserved'
                              : isLocking
                              ? 'Overlap Lock'
                              : isSelected
                              ? 'Deselect Slot'
                              : 'Select Slot'
                          )
                        }
                        onMouseLeave={handleMouseLeave}
                        className={`p-4 rounded-2xl border text-center transition-all relative overflow-hidden flex flex-col justify-center items-center h-20 ${
                          isBooked
                            ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                            : isLocking
                            ? 'bg-amber-50/60 border-amber-300 text-amber-800 animate-pulse cursor-not-allowed'
                            : isSelected
                            ? 'bg-sky-500 border-sky-500 text-white font-semibold'
                            : 'bg-white/40 border-slate-100 text-slate-700 hover:border-sky-300 hover:bg-sky-50/20'
                        }`}
                      >
                        <span className="text-xs font-bold">{slot.time}</span>
                        {isLocking && (
                          <span className="text-[8px] font-bold text-amber-500 flex items-center gap-0.5 mt-1">
                            <RefreshCw size={8} className="animate-spin" />
                            locking...
                          </span>
                        )}
                        {isBooked && (
                          <span className="text-[8px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                            Booked
                          </span>
                        )}
                        {!isBooked && !isLocking && !isSelected && (
                          <span className="text-[8px] text-emerald-500 font-semibold mt-1 uppercase tracking-wider">
                            Available
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-[8px] text-white/90 font-semibold mt-1 uppercase tracking-wider">
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom summary and submit */}
            {!loading && (
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  {selectedSlot ? (
                    <>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Consultation Selection</span>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">
                        {currentDoctor?.name} — {days[selectedDate].month} {days[selectedDate].dateNum} at {slots.find(s => s.id === selectedSlot)?.time}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Please select a time slot to continue.</p>
                  )}
                </div>

                <button
                  onClick={handleConfirmBooking}
                  disabled={!selectedSlot}
                  onMouseEnter={() => handleMouseEnter('Confirm Appointment Integration')}
                  onMouseLeave={handleMouseLeave}
                  className={`px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
                    selectedSlot
                      ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/10'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Sparkles size={13} />
                  Book Appointment
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
