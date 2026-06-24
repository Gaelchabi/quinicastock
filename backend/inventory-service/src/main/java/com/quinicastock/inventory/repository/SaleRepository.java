package com.quinicastock.inventory.repository;

import com.quinicastock.common.lib.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SaleRepository extends JpaRepository<Sale, UUID> {
    List<Sale> findByTenantId(UUID tenantId);
}
