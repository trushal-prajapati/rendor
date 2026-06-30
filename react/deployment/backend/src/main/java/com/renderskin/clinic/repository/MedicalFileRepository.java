package com.renderskin.clinic.repository;

import com.renderskin.clinic.entity.MedicalFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalFileRepository extends JpaRepository<MedicalFile, Long> {
    List<MedicalFile> findByPatientIdOrderByUploadedAtDesc(Long patientId);
}
