import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginView } from './components/LoginView';
import { DoctorDashboard } from './components/DoctorDashboard';
import { ReceptionistDashboard } from './components/ReceptionistDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AnimatedCursor } from './components/AnimatedCursor';
import { PatientPortal } from './PatientPortal';
import { useAuth } from './context/AuthContext';

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'DOCTOR') return <Navigate to="/doctor" replace />;
  if (user.role === 'RECEPTIONIST') return <Navigate to="/receptionist" replace />;
  return <PatientPortal />;
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedCursor />
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route
          path="/"
          element={
            <ProtectedRoute roles={['PATIENT']}>
              <PatientPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute roles={['DOCTOR']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionist"
          element={
            <ProtectedRoute roles={['RECEPTIONIST']}>
              <ReceptionistDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
