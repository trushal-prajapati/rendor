package com.artum.opd.consultation;

import com.artum.opd.appointment.Appointment;
import com.artum.opd.appointment.AppointmentRepository;
import com.artum.opd.common.ResourceNotFoundException;
import com.artum.opd.patient.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    public ConsultationService(
            ConsultationRepository consultationRepository,
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository
    ) {
        this.consultationRepository = consultationRepository;
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public ConsultationResponse complete(Long appointmentId, CompleteConsultationRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id " + appointmentId));

        Consultation consultation = consultationRepository.findByAppointmentId(appointmentId)
                .orElse(null);

        if (consultation == null) {
            consultation = new Consultation(
                    appointment,
                    request.bloodPressure().trim(),
                    request.temperatureC(),
                    cleanNotes(request.notes())
            );
        } else {
            consultation.update(
                    request.bloodPressure().trim(),
                    request.temperatureC(),
                    cleanNotes(request.notes())
            );
        }
        appointment.markCompleted();

        return ConsultationResponse.from(consultationRepository.save(consultation));
    }

    @Transactional(readOnly = true)
    public List<ConsultationResponse> byPatient(Long patientId) {
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient not found with id " + patientId);
        }
        return consultationRepository.findByAppointmentPatientIdOrderByCompletedAtDesc(patientId)
                .stream()
                .map(ConsultationResponse::from)
                .toList();
    }

    private String cleanNotes(String notes) {
        return notes == null ? "" : notes.trim();
    }
}
