package com.artum.opd.patient;

import com.artum.opd.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Transactional
    public PatientResponse register(CreatePatientRequest request) {
        Patient patient = new Patient(
                request.name().trim(),
                request.gender(),
                request.age(),
                request.phoneNumber().trim()
        );
        return PatientResponse.from(patientRepository.save(patient));
    }

    @Transactional(readOnly = true)
    public List<PatientResponse> search(String search) {
        String query = search == null ? "" : search.trim();
        List<Patient> patients = query.isBlank()
                ? patientRepository.findAllByOrderByCreatedAtDesc()
                : patientRepository.findByNameContainingIgnoreCaseOrPhoneNumberContainingIgnoreCaseOrderByCreatedAtDesc(
                        query,
                        query
                );
        return patients.stream().map(PatientResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public Patient getPatient(Long patientId) {
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id " + patientId));
    }
}

