package com.artum.opd.patient;

import java.time.LocalDateTime;

public record PatientResponse(
        Long id,
        String name,
        Gender gender,
        Integer age,
        String phoneNumber,
        LocalDateTime createdAt
) {

    public static PatientResponse from(Patient patient) {
        return new PatientResponse(
                patient.getId(),
                patient.getName(),
                patient.getGender(),
                patient.getAge(),
                patient.getPhoneNumber(),
                patient.getCreatedAt()
        );
    }
}

