export type UserRole = 'PATIENT' | 'DOCTOR' | 'RECEPTIONIST';

export interface AuthUser {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  profileId?: number;
  patientCode?: string;
}

export interface AuthResponse extends AuthUser {
  token: string;
}

export interface ClinicMetrics {
  activePatientsOnline: number;
  availableDoctorsCount: number;
  appointmentsBookedToday: number;
  totalPatients: number;
  pendingAppointments: number;
  consultationLoadPercent: number;
}

export interface Doctor {
  id: number;
  userId: number;
  name: string;
  specialty: string;
  rating: string;
  imageUrl?: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  patientCode: string;
  patientEmail: string;
  doctorId: number;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string;
  timeSlot: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
}

export interface MedicalFile {
  id: number;
  originalName: string;
  contentType: string;
  fileSize: number;
  downloadUrl: string;
  uploadedAt: string;
}

export interface PatientDetail {
  id: number;
  userId: number;
  patientCode: string;
  fullName: string;
  email: string;
  age: string;
  skinType: string;
  concerns: string[];
  allergies: string;
  files: MedicalFile[];
  appointments: Appointment[];
}

export interface PatientRegisterPayload {
  fullName: string;
  email: string;
  password: string;
  age: string;
  skinType: string;
  concerns: string[];
  allergies: string;
}

export interface BookAppointmentPayload {
  doctorId: number;
  appointmentDate: string;
  timeSlot: string;
  notes?: string;
}
