package com.artum.opd.appointment;

import com.artum.opd.common.ResourceNotFoundException;
import com.artum.opd.patient.Patient;
import com.artum.opd.patient.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public AppointmentResponse book(BookAppointmentRequest request) {
        Patient patient = patientRepository.findById(request.patientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id " + request.patientId()));

        Appointment appointment = new Appointment(
                patient,
                request.appointmentAt(),
                request.doctorName().trim()
        );
        return AppointmentResponse.from(appointmentRepository.save(appointment));
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> today() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();
        return appointmentRepository.findByAppointmentAtBetweenOrderByAppointmentAtAsc(start, end)
                .stream()
                .map(AppointmentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> byPatient(Long patientId) {
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient not found with id " + patientId);
        }
        return appointmentRepository.findByPatientIdOrderByAppointmentAtDesc(patientId)
                .stream()
                .map(AppointmentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Appointment getAppointment(Long appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id " + appointmentId));
    }
}

