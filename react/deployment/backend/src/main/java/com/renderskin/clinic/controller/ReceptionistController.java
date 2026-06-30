package com.renderskin.clinic.controller;

import com.renderskin.clinic.dto.AppointmentResponse;
import com.renderskin.clinic.entity.AppointmentStatus;
import com.renderskin.clinic.service.ClinicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/receptionist")
public class ReceptionistController extends BaseController {
    private final ClinicService clinicService;

    public ReceptionistController(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> allAppointments() {
        return ResponseEntity.ok(clinicService.getAllAppointments());
    }

    @PatchMapping("/appointments/{id}/status")
    public ResponseEntity<AppointmentResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        AppointmentStatus status = AppointmentStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(clinicService.updateAppointmentStatus(id, status));
    }
}
