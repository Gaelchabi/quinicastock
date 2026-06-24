package com.quinicastock.tenant.controller;

import com.quinicastock.tenant.service.TenantService;
import com.quinicastock.common.lib.entity.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/tenants")
public class TenantController {
    private final TenantService tenantService;
    
    public TenantController(TenantService tenantService) { this.tenantService = tenantService; }
    
    @PostMapping
    public ResponseEntity<Tenant> createTenant(@RequestBody Tenant tenant) {
        return ResponseEntity.ok(tenantService.createTenant(tenant, null));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Tenant> getTenant(@PathVariable UUID id) {
        return ResponseEntity.ok(tenantService.getTenantById(id));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Tenant> updateTenant(@PathVariable UUID id, @RequestBody Tenant tenant) {
        tenant.setId(id);
        return ResponseEntity.ok(tenantService.updateTenant(tenant));
    }
}
