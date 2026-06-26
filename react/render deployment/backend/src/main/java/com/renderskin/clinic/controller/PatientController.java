package com.renderskin.clinic.controller;

import com.renderskin.clinic.dto.*;
import com.renderskin.clinic.service.ClinicService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/patient")
public class PatientController extends BaseController {
    private final ClinicService clinicService;

    public PatientController(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentResponse> book(@Valid @RequestBody BookAppointmentRequest request) {
        return ResponseEntity.ok(clinicService.bookAppointment(currentUser().getId(), request));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> myAppointments() {
        return ResponseEntity.ok(clinicService.getPatientAppointments(currentUser().getId()));
    }

    @PostMapping("/files")
    public ResponseEntity<MedicalFileResponse> upload(@RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(clinicService.uploadFile(currentUser().getId(), file));
    }

    @GetMapping("/files")
    public ResponseEntity<List<MedicalFileResponse>> myFiles() {
        return ResponseEntity.ok(clinicService.getPatientFiles(currentUser().getId()));
    }
}
