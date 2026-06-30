package com.renderskin.clinic.service;

import com.renderskin.clinic.dto.*;
import com.renderskin.clinic.entity.*;
import com.renderskin.clinic.repository.*;
import com.renderskin.clinic.security.JwtService;
import com.renderskin.clinic.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoderService passwordEncoder;
    private static final AtomicInteger patientCounter = new AtomicInteger(900);

    public AuthService(UserRepository userRepository,
                       PatientProfileRepository patientProfileRepository,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       PasswordEncoderService passwordEncoder) {
        this.userRepository = userRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        AuthResponse response = buildAuthResponse(principal);
        response.setToken(jwtService.generateToken(principal));
        return response;
    }

    @Transactional
    public AuthResponse registerPatient(PatientRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(Role.PATIENT);
        user = userRepository.save(user);

        PatientProfile profile = new PatientProfile();
        profile.setUser(user);
        profile.setPatientCode("PT-" + patientCounter.incrementAndGet());
        profile.setAge(request.getAge());
        profile.setSkinType(request.getSkinType());
        profile.setConcerns(request.getConcerns() != null ? request.getConcerns() : new ArrayList<>());
        profile.setAllergies(request.getAllergies());
        profile = patientProfileRepository.save(profile);

        UserPrincipal principal = new UserPrincipal(user);
        AuthResponse response = buildAuthResponse(principal);
        response.setToken(jwtService.generateToken(principal));
        response.setProfileId(profile.getId());
        response.setPatientCode(profile.getPatientCode());
        return response;
    }

    private AuthResponse buildAuthResponse(UserPrincipal principal) {
        AuthResponse response = new AuthResponse(
                null,
                principal.getId(),
                principal.getFullName(),
                principal.getUsername(),
                principal.getRole()
        );
        if (principal.getRole() == Role.PATIENT) {
            patientProfileRepository.findByUserId(principal.getId()).ifPresent(p -> {
                response.setProfileId(p.getId());
                response.setPatientCode(p.getPatientCode());
            });
        }
        return response;
    }
}
