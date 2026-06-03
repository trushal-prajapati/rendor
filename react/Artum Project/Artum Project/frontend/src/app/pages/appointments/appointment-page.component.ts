import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { Appointment, BookAppointmentPayload, Patient } from '../../models/opd.models';

@Component({
  selector: 'app-appointment-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-page.component.html',
  styleUrl: './appointment-page.component.css'
})
export class AppointmentPageComponent implements OnInit {
  patients: Patient[] = [];
  appointments: Appointment[] = [];
  saving = false;
  loading = false;
  message = '';
  error = '';

  readonly appointmentForm = this.fb.nonNullable.group({
    patientId: [0, [Validators.required, Validators.min(1)]],
    appointmentAt: [this.defaultAppointmentTime(), [Validators.required]],
    doctorName: ['', [Validators.required, Validators.maxLength(120)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService
  ) {
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadTodayAppointments();
  }

  loadPatients(): void {
    this.api.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        if (patients.length && this.appointmentForm.controls.patientId.value === 0) {
          this.appointmentForm.patchValue({ patientId: patients[0].id });
        }
      },
      error: () => this.error = 'Patients load nahi ho paye.'
    });
  }

  loadTodayAppointments(): void {
    this.loading = true;
    this.api.getTodayAppointments()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (appointments) => this.appointments = appointments,
        error: () => this.error = 'Today appointments load nahi ho paye.'
      });
  }

  bookAppointment(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    const formValue = this.appointmentForm.getRawValue();
    const payload: BookAppointmentPayload = {
      patientId: Number(formValue.patientId),
      appointmentAt: formValue.appointmentAt,
      doctorName: formValue.doctorName.trim()
    };

    this.saving = true;
    this.message = '';
    this.error = '';

    this.api.bookAppointment(payload)
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: () => {
          this.message = 'Appointment book ho gaya.';
          this.appointmentForm.patchValue({
            appointmentAt: this.defaultAppointmentTime(),
            doctorName: ''
          });
          this.loadTodayAppointments();
        },
        error: () => this.error = 'Appointment save nahi ho paya. Date/time aur patient check karein.'
      });
  }

  private defaultAppointmentTime(): string {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    return this.toDateTimeLocal(date);
  }

  private toDateTimeLocal(date: Date): string {
    const pad = (value: number) => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}

