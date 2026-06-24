package com.quinicastock.inventory.repository;

import com.quinicastock.common.lib.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByTenantId(UUID tenantId);
}
