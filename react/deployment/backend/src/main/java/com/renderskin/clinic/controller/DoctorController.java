package com.renderskin.clinic.controller;

import com.renderskin.clinic.dto.AppointmentResponse;
import com.renderskin.clinic.dto.PatientDetailResponse;
import com.renderskin.clinic.service.ClinicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController extends BaseController {
    private final ClinicService clinicService;

    public DoctorController(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> appointments() {
        return ResponseEntity.ok(clinicService.getDoctorAppointments(currentUser().getId()));
    }

    @GetMapping("/patients")
    public ResponseEntity<List<PatientDetailResponse>> patients() {
        return ResponseEntity.ok(clinicService.getDoctorPatients(currentUser().getId()));
    }

    @GetMapping("/patients/{id}")
    public ResponseEntity<PatientDetailResponse> patientDetail(@PathVariable Long id) {
        return ResponseEntity.ok(clinicService.getPatientDetail(id));
    }
}
