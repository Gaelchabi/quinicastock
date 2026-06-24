package com.quinicastock.tenant.repository;

import com.quinicastock.common.lib.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, UUID> {}
