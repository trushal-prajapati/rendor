import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { CreatePatientPayload, Gender, Patient } from '../../models/opd.models';

@Component({
  selector: 'app-patient-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './patient-page.component.html',
  styleUrl: './patient-page.component.css'
})
export class PatientPageComponent implements OnInit {
  readonly genders: Gender[] = ['MALE', 'FEMALE', 'OTHER'];

  patients: Patient[] = [];
  searchTerm = '';
  loading = false;
  saving = false;
  message = '';
  error = '';

  readonly patientForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    gender: ['MALE' as Gender, [Validators.required]],
    age: [30, [Validators.required, Validators.min(0), Validators.max(130)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\- ]{7,20}$/)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService
  ) {
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.error = '';

    this.api.getPatients(this.searchTerm)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (patients) => this.patients = patients,
        error: () => this.error = 'Patients load nahi ho paye. Backend check karein.'
      });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadPatients();
  }

  savePatient(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    const formValue = this.patientForm.getRawValue();
    const payload: CreatePatientPayload = {
      name: formValue.name.trim(),
      gender: formValue.gender,
      age: Number(formValue.age),
      phoneNumber: formValue.phoneNumber.trim()
    };

    this.saving = true;
    this.message = '';
    this.error = '';

    this.api.createPatient(payload)
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: () => {
          this.message = 'Patient register ho gaya.';
          this.patientForm.reset({ name: '', gender: 'MALE', age: 30, phoneNumber: '' });
          this.loadPatients();
        },
        error: () => this.error = 'Patient save nahi ho paya. Input values check karein.'
      });
  }
}

