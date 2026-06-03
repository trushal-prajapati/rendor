package com.artum.opd.appointment;

import java.time.LocalDateTime;

public record AppointmentResponse(
        Long id,
        Long patientId,
        String patientName,
        String phoneNumber,
        LocalDateTime appointmentAt,
        String doctorName,
        AppointmentStatus status
) {

    public static AppointmentResponse from(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getPatient().getName(),
                appointment.getPatient().getPhoneNumber(),
                appointment.getAppointmentAt(),
                appointment.getDoctorName(),
                appointment.getStatus()
        );
    }
}

