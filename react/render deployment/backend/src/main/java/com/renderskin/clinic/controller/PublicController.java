package com.renderskin.clinic.controller;

import com.renderskin.clinic.dto.ClinicMetricsResponse;
import com.renderskin.clinic.dto.DoctorResponse;
import com.renderskin.clinic.entity.MedicalFile;
import com.renderskin.clinic.entity.Role;
import com.renderskin.clinic.security.UserPrincipal;
import com.renderskin.clinic.service.ClinicService;
import com.renderskin.clinic.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicController {
    private final ClinicService clinicService;
    private final FileStorageService fileStorageService;

    public PublicController(ClinicService clinicService, FileStorageService fileStorageService) {
        this.clinicService = clinicService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponse>> doctors() {
        return ResponseEntity.ok(clinicService.getDoctors());
    }

    @GetMapping("/metrics")
    public ResponseEntity<ClinicMetricsResponse> metrics() {
        return ResponseEntity.ok(clinicService.getMetrics());
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) throws Exception {
        MedicalFile file = clinicService.getFileEntity(id);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            return ResponseEntity.status(401).build();
        }

        boolean allowed = principal.getRole() == Role.DOCTOR
                || principal.getRole() == Role.RECEPTIONIST
                || file.getPatient().getUser().getId().equals(principal.getId());

        if (!allowed) {
            return ResponseEntity.status(403).build();
        }

        Path path = fileStorageService.load(file.getFileName());
        Resource resource = new UrlResource(path.toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getOriginalName() + "\"")
                .body(resource);
    }
}
