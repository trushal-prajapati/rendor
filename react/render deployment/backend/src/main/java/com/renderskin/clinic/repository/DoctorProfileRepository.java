package com.renderskin.clinic.repository;

import com.renderskin.clinic.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {
    Optional<DoctorProfile> findByUserId(Long userId);
}
