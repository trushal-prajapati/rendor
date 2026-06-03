package com.artum.opd.appointment;

import com.artum.opd.patient.Patient;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "appointments",
        indexes = {
                @Index(name = "idx_appointment_at", columnList = "appointment_at"),
                @Index(name = "idx_appointment_status", columnList = "status")
        }
)
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "appointment_at", nullable = false)
    private LocalDateTime appointmentAt;

    @Column(name = "doctor_name", nullable = false, length = 120)
    private String doctorName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AppointmentStatus status = AppointmentStatus.BOOKED;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected Appointment() {
    }

    public Appointment(Patient patient, LocalDateTime appointmentAt, String doctorName) {
        this.patient = patient;
        this.appointmentAt = appointmentAt;
        this.doctorName = doctorName;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Patient getPatient() {
        return patient;
    }

    public LocalDateTime getAppointmentAt() {
        return appointmentAt;
    }

    public void setAppointmentAt(LocalDateTime appointmentAt) {
        this.appointmentAt = appointmentAt;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void markCompleted() {
        this.status = AppointmentStatus.COMPLETED;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

