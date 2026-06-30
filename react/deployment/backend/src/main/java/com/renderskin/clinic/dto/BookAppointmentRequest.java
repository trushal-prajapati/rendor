package com.renderskin.clinic.dto;

import com.renderskin.clinic.entity.AppointmentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BookAppointmentRequest {
    @NotNull private Long doctorId;
    @NotNull private LocalDate appointmentDate;
    @NotBlank private String timeSlot;
    private String notes;

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
