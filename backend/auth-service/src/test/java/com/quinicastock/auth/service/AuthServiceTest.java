package com.quinicastock.auth.service;

import com.quinicastock.auth.repository.UserRepository;
import com.quinicastock.common.lib.dto.*;
import com.quinicastock.common.lib.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.crypto.SecretKey;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private SecretKey jwtSecretKey;
    
    private AuthService authService;
    
    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, jwtSecretKey, 86400000L);
    }
    
    @Test
    void register_shouldCreateUser() {
        RegisterRequest request = new RegisterRequest("test@test.com", "password123", "Test User");
        when(userRepository.existsByEmail("test@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User user = inv.getArgument(0);
            user.setId(UUID.randomUUID());
            return user;
        });
        
        AuthResponse response = authService.register(request);
        
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("Bearer", response.getType());
        verify(userRepository).save(any(User.class));
    }
    
    @Test
    void register_shouldThrowExceptionIfEmailExists() {
        RegisterRequest request = new RegisterRequest("existing@test.com", "password", "Test");
        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);
        
        assertThrows(RuntimeException.class, () -> authService.register(request));
    }
    
    @Test
    void login_shouldReturnToken() {
        LoginRequest request = new LoginRequest("test@test.com", "password123");
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@test.com");
        user.setPassword("encodedPassword");
        
        when(userRepository.findByEmail("test@test.com")).thenReturn(java.util.Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        
        AuthResponse response = authService.login(request);
        
        assertNotNull(response);
        assertNotNull(response.getToken());
    }
    
    @Test
    void login_shouldThrowExceptionForInvalidCredentials() {
        LoginRequest request = new LoginRequest("test@test.com", "wrongPassword");
        
        when(userRepository.findByEmail("test@test.com")).thenReturn(java.util.Optional.empty());
        
        assertThrows(RuntimeException.class, () -> authService.login(request));
    }
}