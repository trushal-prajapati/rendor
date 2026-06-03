package com.artum.opd.appointment;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record BookAppointmentRequest(
        @NotNull(message = "Patient is required")
        Long patientId,

        @NotNull(message = "Appointment date and time is required")
        @FutureOrPresent(message = "Appointment should not be in the past")
        LocalDateTime appointmentAt,

        @NotBlank(message = "Doctor name is required")
        String doctorName
) {
}

