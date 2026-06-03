package com.artum.opd.appointment;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse book(@Valid @RequestBody BookAppointmentRequest request) {
        return appointmentService.book(request);
    }

    @GetMapping("/today")
    public List<AppointmentResponse> today() {
        return appointmentService.today();
    }

    @GetMapping("/patient/{patientId}")
    public List<AppointmentResponse> byPatient(@PathVariable Long patientId) {
        return appointmentService.byPatient(patientId);
    }
}

