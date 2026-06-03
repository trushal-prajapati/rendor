export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type AppointmentStatus = 'BOOKED' | 'COMPLETED';

export interface Patient {
  id: number;
  name: string;
  gender: Gender;
  age: number;
  phoneNumber: string;
  createdAt: string;
}

export interface CreatePatientPayload {
  name: string;
  gender: Gender;
  age: number;
  phoneNumber: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  phoneNumber: string;
  appointmentAt: string;
  doctorName: string;
  status: AppointmentStatus;
}

export interface BookAppointmentPayload {
  patientId: number;
  appointmentAt: string;
  doctorName: string;
}

export interface Consultation {
  id: number;
  appointmentId: number;
  patientId: number;
  patientName: string;
  doctorName: string;
  appointmentAt: string;
  bloodPressure: string;
  temperatureC: number;
  notes: string;
  completedAt: string;
}

export interface CompleteConsultationPayload {
  bloodPressure: string;
  temperatureC: number;
  notes: string;
}

