package com.quinicastock.tenant.service;

import com.quinicastock.tenant.repository.TenantRepository;
import com.quinicastock.tenant.repository.LocationRepository;
import com.quinicastock.common.lib.entity.Tenant;
import com.quinicastock.common.lib.entity.Location;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TenantServiceTest {
    
    @Mock
    private TenantRepository tenantRepository;
    @Mock
    private LocationRepository locationRepository;
    
    private TenantService tenantService;
    
    @BeforeEach
    void setUp() {
        tenantService = new TenantService(tenantRepository, locationRepository);
    }
    
    @Test
    void createTenant_shouldCreateTenant() {
        Tenant tenant = new Tenant();
        tenant.setName("Test Store");
        tenant.setOwner("John Doe");
        tenant.setPhone("+2250123456789");
        tenant.setCountry("Côte d'Ivoire");
        tenant.setCity("Abidjan");
        tenant.setCurrency("XOF");
        
        when(tenantRepository.save(any(Tenant.class))).thenAnswer(inv -> {
            Tenant t = inv.getArgument(0);
            t.setId(UUID.randomUUID());
            return t;
        });
        
        Tenant result = tenantService.createTenant(tenant, null);
        
        assertNotNull(result.getId());
        assertEquals("Test Store", result.getName());
        verify(tenantRepository).save(any(Tenant.class));
    }
    
    @Test
    void createTenant_shouldCreateLocationWithTenant() {
        Tenant tenant = new Tenant();
        tenant.setName("Test Store");
        
        Location location = new Location();
        location.setName("Main Store");
        location.setCity("Abidjan");
        
        UUID tenantId = UUID.randomUUID();
        
        when(tenantRepository.save(any(Tenant.class))).thenAnswer(inv -> {
            Tenant t = inv.getArgument(0);
            t.setId(tenantId);
            return t;
        });
        
        Tenant result = tenantService.createTenant(tenant, location);
        
        assertNotNull(result.getId());
        verify(locationRepository).save(any(Location.class));
    }
    
    @Test
    void getTenantById_shouldReturnTenant() {
        UUID id = UUID.randomUUID();
        Tenant tenant = new Tenant();
        tenant.setId(id);
        tenant.setName("Test");
        
        when(tenantRepository.findById(id)).thenReturn(java.util.Optional.of(tenant));
        
        Tenant result = tenantService.getTenantById(id);
        
        assertNotNull(result);
        assertEquals("Test", result.getName());
    }
}