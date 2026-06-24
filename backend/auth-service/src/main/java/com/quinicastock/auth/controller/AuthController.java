package com.quinicastock.auth.controller;

import com.quinicastock.auth.service.AuthService;
import com.quinicastock.common.lib.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }
    @PostMapping("/register") public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) { return ResponseEntity.ok(authService.register(request)); }
    @PostMapping("/login") public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) { return ResponseEntity.ok(authService.login(request)); }
    @PutMapping("/user/tenant") public ResponseEntity<Void> setUserTenant(@RequestBody SetTenantRequest request) { authService.setUserTenant(request.getUserId(), request.getTenantId()); return ResponseEntity.ok().build(); }
}

class SetTenantRequest {
    private UUID userId;
    private UUID tenantId;
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
}
