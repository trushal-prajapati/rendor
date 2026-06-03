import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import {
  Appointment,
  CompleteConsultationPayload,
  Consultation,
  Patient
} from '../../models/opd.models';

@Component({
  selector: 'app-consultation-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './consultation-page.component.html',
  styleUrl: './consultation-page.component.css'
})
export class ConsultationPageComponent implements OnInit {
  patients: Patient[] = [];
  appointments: Appointment[] = [];
  consultations: Consultation[] = [];
  historyPatientId = 0;
  saving = false;
  loadingHistory = false;
  message = '';
  error = '';

  readonly consultationForm = this.fb.nonNullable.group({
    appointmentId: [0, [Validators.required, Validators.min(1)]],
    bloodPressure: ['120/80', [Validators.required, Validators.maxLength(30)]],
    temperatureC: [37, [Validators.required, Validators.min(30), Validators.max(45)]],
    notes: ['', [Validators.maxLength(1000)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService
  ) {
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadAppointments();
  }

  get openAppointments(): Appointment[] {
    return this.appointments.filter((appointment) => appointment.status === 'BOOKED');
  }

  loadPatients(): void {
    this.api.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        if (patients.length && this.historyPatientId === 0) {
          this.historyPatientId = patients[0].id;
          this.loadPatientHistory();
        }
      },
      error: () => this.error = 'Patients load nahi ho paye.'
    });
  }

  loadAppointments(): void {
    this.api.getTodayAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        const firstOpen = this.openAppointments[0];
        this.consultationForm.patchValue({ appointmentId: firstOpen?.id ?? 0 });
      },
      error: () => this.error = 'Appointments load nahi ho paye.'
    });
  }

  completeConsultation(): void {
    if (this.consultationForm.invalid) {
      this.consultationForm.markAllAsTouched();
      return;
    }

    const formValue = this.consultationForm.getRawValue();
    const payload: CompleteConsultationPayload = {
      bloodPressure: formValue.bloodPressure.trim(),
      temperatureC: Number(formValue.temperatureC),
      notes: formValue.notes.trim()
    };

    this.saving = true;
    this.message = '';
    this.error = '';

    this.api.completeConsultation(Number(formValue.appointmentId), payload)
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: (consultation) => {
          this.message = 'Consultation complete ho gaya.';
          this.historyPatientId = consultation.patientId;
          this.consultationForm.patchValue({
            bloodPressure: '120/80',
            temperatureC: 37,
            notes: ''
          });
          this.loadAppointments();
          this.loadPatientHistory();
        },
        error: () => this.error = 'Consultation save nahi ho paya. Appointment aur vitals check karein.'
      });
  }

  loadPatientHistory(): void {
    if (!this.historyPatientId) {
      this.consultations = [];
      return;
    }

    this.loadingHistory = true;
    this.api.getPatientConsultations(Number(this.historyPatientId))
      .pipe(finalize(() => this.loadingHistory = false))
      .subscribe({
        next: (consultations) => this.consultations = consultations,
        error: () => this.error = 'Consultation history load nahi ho payi.'
      });
  }
}

