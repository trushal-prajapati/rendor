package com.artum.opd.patient;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    List<Patient> findAllByOrderByCreatedAtDesc();

    List<Patient> findByNameContainingIgnoreCaseOrPhoneNumberContainingIgnoreCaseOrderByCreatedAtDesc(
            String name,
            String phoneNumber
    );
}

