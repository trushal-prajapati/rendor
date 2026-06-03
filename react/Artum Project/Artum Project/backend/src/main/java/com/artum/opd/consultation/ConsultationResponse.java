package com.artum.opd.consultation;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ConsultationResponse(
        Long id,
        Long appointmentId,
        Long patientId,
        String patientName,
        String doctorName,
        LocalDateTime appointmentAt,
        String bloodPressure,
        BigDecimal temperatureC,
        String notes,
        LocalDateTime completedAt
) {

    public static ConsultationResponse from(Consultation consultation) {
        return new ConsultationResponse(
                consultation.getId(),
                consultation.getAppointment().getId(),
                consultation.getAppointment().getPatient().getId(),
                consultation.getAppointment().getPatient().getName(),
                consultation.getAppointment().getDoctorName(),
                consultation.getAppointment().getAppointmentAt(),
                consultation.getBloodPressure(),
                consultation.getTemperatureC(),
                consultation.getNotes(),
                consultation.getCompletedAt()
        );
    }
}

