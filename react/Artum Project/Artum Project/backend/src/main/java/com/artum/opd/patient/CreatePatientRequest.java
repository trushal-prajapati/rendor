package com.artum.opd.patient;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CreatePatientRequest(
        @NotBlank(message = "Patient name is required")
        String name,

        @NotNull(message = "Gender is required")
        Gender gender,

        @NotNull(message = "Age is required")
        @Min(value = 0, message = "Age cannot be negative")
        @Max(value = 130, message = "Age looks invalid")
        Integer age,

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[0-9+\\- ]{7,20}$", message = "Phone number is invalid")
        String phoneNumber
) {
}

