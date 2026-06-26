package com.renderskin.clinic.config;

import com.renderskin.clinic.entity.*;
import com.renderskin.clinic.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      DoctorProfileRepository doctorProfileRepository,
                      PatientProfileRepository patientProfileRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        User receptionist = createUser("reception@renderskin.com", "Reception Desk", Role.RECEPTIONIST);

        User doctor1 = createUser("sarah.jenkins@renderskin.com", "Dr. Sarah Jenkins", Role.DOCTOR);
        DoctorProfile dp1 = new DoctorProfile();
        dp1.setUser(doctor1);
        dp1.setSpecialty("General & Pediatric Dermatology");
        dp1.setRating("4.9");
        dp1.setImageUrl("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200");
        doctorProfileRepository.save(dp1);

        User doctor2 = createUser("marcus.vance@renderskin.com", "Dr. Marcus Vance", Role.DOCTOR);
        DoctorProfile dp2 = new DoctorProfile();
        dp2.setUser(doctor2);
        dp2.setSpecialty("Procedural Dermatologic Surgery");
        dp2.setRating("4.8");
        dp2.setImageUrl("https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200");
        doctorProfileRepository.save(dp2);

        User patient = createUser("patient@demo.com", "Jane Demo", Role.PATIENT);
        PatientProfile pp = new PatientProfile();
        pp.setUser(patient);
        pp.setPatientCode("PT-901");
        pp.setAge("28");
        pp.setSkinType("Combination");
        pp.getConcerns().add("Acne/Pimples");
        pp.getConcerns().add("Hyperpigmentation");
        pp.setAllergies("None");
        patientProfileRepository.save(pp);
    }

    private User createUser(String email, String name, Role role) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("password123"));
        user.setFullName(name);
        user.setRole(role);
        return userRepository.save(user);
    }
}
