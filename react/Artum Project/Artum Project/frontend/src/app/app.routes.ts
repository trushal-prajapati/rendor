import { Routes } from '@angular/router';
import { PatientPageComponent } from './pages/patients/patient-page.component';
import { AppointmentPageComponent } from './pages/appointments/appointment-page.component';
import { ConsultationPageComponent } from './pages/consultations/consultation-page.component';

export const routes: Routes = [
  { path: 'patients', component: PatientPageComponent },
  { path: 'appointments', component: AppointmentPageComponent },
  { path: 'consultations', component: ConsultationPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'patients' },
  { path: '**', redirectTo: 'patients' }
];

