package com.quinicastock.common.lib.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;
    
    @Column(name = "category_id")
    private UUID categoryId;
    
    @Column(nullable = false)
    private String name;
    
    private Integer quantity;
    private BigDecimal price;
    private String unit;
    
    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold;
    
    private String description;
}