import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from './hooks/useWebSocket';
import { useCursor, PageTheme } from './context/CursorContext';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { RegistrationView } from './components/RegistrationView';
import { BookingView } from './components/BookingView';
import { ConsultationView } from './components/ConsultationView';
import { RealTimeBanner } from './components/RealTimeBanner';
import { NotificationToast } from './components/NotificationToast';
import { ChatbotWidget } from './components/ChatbotWidget';

export const PatientPortal = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const { setPageTheme } = useCursor();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const {
    status,
    metrics,
    logs,
    simulateDisconnect,
    addLog,
    registerMessageListener,
  } = useWebSocket();

  const handleNavigate = (tab: string, theme: PageTheme) => {
    setCurrentTab(tab);
    setPageTheme(theme);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen flex flex-col z-10 select-none">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        wsStatus={status}
        onSimulateDisconnect={simulateDisconnect}
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full pb-24 px-6">
        {currentTab === 'home' && (
          <HomeView metrics={metrics} onNavigate={handleNavigate} />
        )}

        {currentTab === 'registration' && (
          <RegistrationView
            onTriggerLog={addLog}
            onCompleteRegistration={() => handleNavigate('booking', 'booking')}
          />
        )}

        {currentTab === 'booking' && (
          <BookingView
            onTriggerLog={addLog}
            onCompleteBooking={() => handleNavigate('consultation', 'consultation')}
          />
        )}

        {currentTab === 'consultation' && (
          <ConsultationView onTriggerLog={addLog} />
        )}
      </main>

      <ChatbotWidget />
      <RealTimeBanner status={status} />
      <NotificationToast logs={logs} registerListener={registerMessageListener} />
    </div>
  );
};
