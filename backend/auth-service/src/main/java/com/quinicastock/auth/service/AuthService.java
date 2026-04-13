package com.quinicastock.auth.service;

import com.quinicastock.auth.repository.UserRepository;
import com.quinicastock.common.lib.dto.*;
import com.quinicastock.common.lib.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecretKey jwtSecretKey;
    private final long jwtExpiration;
    
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, SecretKey jwtSecretKey, @Value("${app.jwt-expiration}") long jwtExpiration) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtSecretKey = jwtSecretKey;
        this.jwtExpiration = jwtExpiration;
    }
    
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) throw new RuntimeException("Email already exists");
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setCreatedAt(LocalDateTime.now());
        user = userRepository.save(user);
        return new AuthResponse(generateToken(user.getId(), user.getTenantId(), user.getRole()), "Bearer", user.getId(), user.getTenantId(), user.getRole());
    }
    
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) throw new RuntimeException("Invalid credentials");
        return new AuthResponse(generateToken(user.getId(), user.getTenantId(), user.getRole()), "Bearer", user.getId(), user.getTenantId(), user.getRole());
    }
    
    private String generateToken(UUID userId, UUID tenantId, String role) {
        return Jwts.builder().subject(userId.toString())
            .claim("userId", userId.toString())
            .claim("tenantId", tenantId != null ? tenantId.toString() : null)
            .claim("role", role)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(jwtSecretKey).compact();
    }
}