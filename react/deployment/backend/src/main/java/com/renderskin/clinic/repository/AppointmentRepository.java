package com.renderskin.clinic.repository;

import com.renderskin.clinic.entity.Appointment;
import com.renderskin.clinic.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientIdOrderByAppointmentDateDesc(Long patientId);
    List<Appointment> findByDoctorIdOrderByAppointmentDateDesc(Long doctorId);
    List<Appointment> findAllByOrderByAppointmentDateDesc();
    long countByAppointmentDateAndStatus(LocalDate date, AppointmentStatus status);
}
