package com.quinicastock.common.lib.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tenants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tenant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    private String owner;
    private String phone;
    private String country;
    private String city;
    private String currency;
    
    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold = 10;
    
    @Column(name = "notifications_enabled")
    private Boolean notificationsEnabled = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}