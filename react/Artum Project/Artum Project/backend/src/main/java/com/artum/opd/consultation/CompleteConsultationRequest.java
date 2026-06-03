package com.artum.opd.consultation;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CompleteConsultationRequest(
        @NotBlank(message = "Blood pressure is required")
        String bloodPressure,

        @NotNull(message = "Temperature is required")
        @DecimalMin(value = "30.0", message = "Temperature looks too low")
        @DecimalMax(value = "45.0", message = "Temperature looks too high")
        BigDecimal temperatureC,

        @Size(max = 1000, message = "Notes should be under 1000 characters")
        String notes
) {
}

