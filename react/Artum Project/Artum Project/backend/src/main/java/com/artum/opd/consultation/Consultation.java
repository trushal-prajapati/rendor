package com.artum.opd.consultation;

import com.artum.opd.appointment.Appointment;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "consultations",
        indexes = @Index(name = "idx_consultation_completed_at", columnList = "completed_at")
)
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    @Column(name = "blood_pressure", nullable = false, length = 30)
    private String bloodPressure;

    @Column(name = "temperature_c", nullable = false, precision = 4, scale = 1)
    private BigDecimal temperatureC;

    @Column(length = 1000)
    private String notes;

    @Column(name = "completed_at", nullable = false)
    private LocalDateTime completedAt;

    protected Consultation() {
    }

    public Consultation(Appointment appointment, String bloodPressure, BigDecimal temperatureC, String notes) {
        this.appointment = appointment;
        update(bloodPressure, temperatureC, notes);
    }

    public void update(String bloodPressure, BigDecimal temperatureC, String notes) {
        this.bloodPressure = bloodPressure;
        this.temperatureC = temperatureC;
        this.notes = notes;
        this.completedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public String getBloodPressure() {
        return bloodPressure;
    }

    public BigDecimal getTemperatureC() {
        return temperatureC;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}

