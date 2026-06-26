package com.renderskin.clinic.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordEncoderService {
    private final PasswordEncoder encoder;

    public PasswordEncoderService(PasswordEncoder encoder) {
        this.encoder = encoder;
    }

    public String encode(String raw) { return encoder.encode(raw); }
    public boolean matches(String raw, String encoded) { return encoder.matches(raw, encoded); }
}
