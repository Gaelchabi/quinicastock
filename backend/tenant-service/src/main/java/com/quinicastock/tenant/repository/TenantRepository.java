package com.quinicastock.tenant.repository;

import com.quinicastock.common.lib.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {}
