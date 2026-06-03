package com.artum.opd.patient;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PatientResponse register(@Valid @RequestBody CreatePatientRequest request) {
        return patientService.register(request);
    }

    @GetMapping
    public List<PatientResponse> search(@RequestParam(required = false) String search) {
        return patientService.search(search);
    }

    @GetMapping("/{patientId}")
    public PatientResponse getOne(@PathVariable Long patientId) {
        return PatientResponse.from(patientService.getPatient(patientId));
    }
}

