import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Appointment,
  BookAppointmentPayload,
  CompleteConsultationPayload,
  Consultation,
  CreatePatientPayload,
  Patient
} from '../models/opd.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {
  }

  createPatient(payload: CreatePatientPayload): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/patients`, payload);
  }

  getPatients(search = ''): Observable<Patient[]> {
    const suffix = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
    return this.http.get<Patient[]>(`${this.apiUrl}/patients${suffix}`);
  }

  bookAppointment(payload: BookAppointmentPayload): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, payload);
  }

  getTodayAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/today`);
  }

  completeConsultation(appointmentId: number, payload: CompleteConsultationPayload): Observable<Consultation> {
    return this.http.post<Consultation>(
      `${this.apiUrl}/consultations/appointment/${appointmentId}/complete`,
      payload
    );
  }

  getPatientConsultations(patientId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/consultations/patient/${patientId}`);
  }
}

