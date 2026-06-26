import { useState, useEffect, useCallback, useRef } from 'react';

export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';

export interface ClinicMetrics {
  activePatientsOnline: number;
  availableDoctorsCount: number;
  appointmentsBookedToday: number;
  chatbotQueriesProcessed: number;
  consultationLoadPercent: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

const INITIAL_METRICS: ClinicMetrics = {
  activePatientsOnline: 24,
  availableDoctorsCount: 5,
  appointmentsBookedToday: 38,
  chatbotQueriesProcessed: 215,
  consultationLoadPercent: 70,
};

export const useWebSocket = () => {
  const [status, setStatus] = useState<ConnectionStatus>('connected');
  const [metrics, setMetrics] = useState<ClinicMetrics>(INITIAL_METRICS);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const onMessageRef = useRef<((log: ActivityLog) => void) | null>(null);

  // Set message listener
  const registerMessageListener = useCallback((callback: (log: ActivityLog) => void) => {
    onMessageRef.current = callback;
  }, []);

  // Helper to add activity logs
  const addLog = useCallback((type: ActivityLog['type'], message: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 50));
    if (onMessageRef.current) {
      onMessageRef.current(newLog);
    }
  }, []);

  // Trigger manual simulation commands
  const simulateDisconnect = useCallback(() => {
    if (status !== 'connected') return;
    setStatus('disconnected');
    addLog('error', 'WebSocket connection to wss://api.skinclinic.render-java/realtime disrupted.');
    
    // Auto-reconnect flow after 4 seconds
    setTimeout(() => {
      setStatus('reconnecting');
      addLog('warning', 'Attempting WebSocket auto-reconnect (1/3)...');
      
      setTimeout(() => {
        setStatus('connected');
        addLog('success', 'WebSocket connection established securely on wss://api.skinclinic.render-java/realtime');
      }, 2500);
    }, 4000);
  }, [status, addLog]);

  // Clinic metrics fluctuation simulator
  useEffect(() => {
    if (status !== 'connected') return;

    const interval = setInterval(() => {
      setMetrics((prev) => {
        const patientsDelta = Math.floor((Math.random() - 0.5) * 4);
        const chatbotDelta = Math.floor(Math.random() * 3);
        const loadDelta = (Math.random() - 0.5) * 5;

        return {
          activePatientsOnline: Math.max(prev.activePatientsOnline + patientsDelta, 5),
          availableDoctorsCount: Math.min(Math.max(prev.availableDoctorsCount + (Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0), 1), 8),
          appointmentsBookedToday: prev.appointmentsBookedToday + (Math.random() > 0.85 ? 1 : 0),
          chatbotQueriesProcessed: prev.chatbotQueriesProcessed + chatbotDelta,
          consultationLoadPercent: Math.min(Math.max(parseFloat((prev.consultationLoadPercent + loadDelta).toFixed(1)), 20), 98),
        };
      });

      // Randomly push clinic event logs
      if (Math.random() > 0.65) {
        const events = [
          { type: 'info' as const, msg: 'Patient registration form wizard initiated from client portal.' },
          { type: 'success' as const, msg: 'New Patient Registration completed successfully (Patient ID: PT-901).' },
          { type: 'warning' as const, msg: 'Time Slot 10:30 AM temporarily locked for booking selection.' },
          { type: 'success' as const, msg: 'Appointment successfully confirmed for Dr. Sarah Jenkins (11:00 AM).' },
          { type: 'info' as const, msg: 'AI Chatbot triaged patient query regarding dermatological rash symptoms.' },
          { type: 'info' as const, msg: 'Dr. Sarah Jenkins uploaded digital prescription card for Room #2.' },
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        addLog(randomEvent.type, randomEvent.msg);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [status, addLog]);

  // Push initial message logs
  useEffect(() => {
    addLog('success', 'Skin Medical Clinic client portal loaded successfully.');
    addLog('info', 'WebSocket real-time sync listening on /topic/appointments.');
  }, []);

  return {
    status,
    metrics,
    logs,
    simulateDisconnect,
    addLog,
    registerMessageListener,
  };
};
