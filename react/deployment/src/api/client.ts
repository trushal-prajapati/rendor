import type {
  Appointment,
  AuthResponse,
  BookAppointmentPayload,
  ClinicMetrics,
  Doctor,
  MedicalFile,
  PatientDetail,
  PatientRegisterPayload,
} from './types';

const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('clinic_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (payload: PatientRegisterPayload) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMetrics: () => request<ClinicMetrics>('/metrics'),

  getDoctors: () => request<Doctor[]>('/doctors'),

  bookAppointment: (payload: BookAppointmentPayload) =>
    request<Appointment>('/patient/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMyAppointments: () => request<Appointment[]>('/patient/appointments'),

  uploadFile: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return request<MedicalFile>('/patient/files', { method: 'POST', body: form });
  },

  getMyFiles: () => request<MedicalFile[]>('/patient/files'),

  getReceptionistAppointments: () =>
    request<Appointment[]>('/receptionist/appointments'),

  updateAppointmentStatus: (id: number, status: string) =>
    request<Appointment>(`/receptionist/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getDoctorAppointments: () => request<Appointment[]>('/doctor/appointments'),

  getDoctorPatients: () => request<PatientDetail[]>('/doctor/patients'),

  getPatientDetail: (id: number) => request<PatientDetail>(`/doctor/patients/${id}`),

  fileUrl: (path: string) => `${API_BASE}${path}`,
};
