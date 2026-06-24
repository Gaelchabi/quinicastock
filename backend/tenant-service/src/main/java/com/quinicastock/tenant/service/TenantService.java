package com.quinicastock.tenant.service;

import com.quinicastock.tenant.repository.*;
import com.quinicastock.common.lib.entity.*;
import org.springframework.stereotype.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class TenantService {
    private final TenantRepository tenantRepository;
    private final LocationRepository locationRepository;

    public TenantService(TenantRepository tenantRepository, LocationRepository locationRepository) {
        this.tenantRepository = tenantRepository;
        this.locationRepository = locationRepository;
    }

    public Tenant createTenant(Tenant tenant, Location location) {
        tenant.setCreatedAt(LocalDateTime.now());
        tenant = tenantRepository.save(tenant);
        if (location != null) {
            location.setTenantId(tenant.getId());
            location.setIsMain(true);
            location.setCreatedAt(LocalDateTime.now());
            locationRepository.save(location);
        }
        return tenant;
    }

    public Tenant getTenantById(UUID id) {
        return tenantRepository.findById(id).orElse(null);
    }

    public Tenant updateTenant(Tenant tenant) {
        return tenantRepository.save(tenant);
    }

    public Location createLocation(Location location) {
        location.setCreatedAt(LocalDateTime.now());
        return locationRepository.save(location);
    }
}
