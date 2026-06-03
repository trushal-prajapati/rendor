package com.artum.opd.consultation;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;

    public ConsultationController(ConsultationService consultationService) {
        this.consultationService = consultationService;
    }

    @PostMapping("/appointment/{appointmentId}/complete")
    public ConsultationResponse complete(
            @PathVariable Long appointmentId,
            @Valid @RequestBody CompleteConsultationRequest request
    ) {
        return consultationService.complete(appointmentId, request);
    }

    @GetMapping("/patient/{patientId}")
    public List<ConsultationResponse> byPatient(@PathVariable Long patientId) {
        return consultationService.byPatient(patientId);
    }
}

