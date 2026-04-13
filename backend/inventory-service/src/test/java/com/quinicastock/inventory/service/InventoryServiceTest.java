package com.quinicastock.inventory.service;

import com.quinicastock.inventory.repository.*;
import com.quinicastock.common.lib.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {
    
    @Mock private ProductRepository productRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private SaleRepository saleRepository;
    @Mock private SupplierRepository supplierRepository;
    
    private InventoryService service;
    
    @BeforeEach
    void setUp() {
        service = new InventoryService(productRepository, categoryRepository, saleRepository, supplierRepository);
    }
    
    @Test
    void getProducts_shouldReturnProductsByTenant() {
        UUID tenantId = UUID.randomUUID();
        Product p1 = new Product(); p1.setName("Product 1");
        Product p2 = new Product(); p2.setName("Product 2");
        
        when(productRepository.findByTenantId(tenantId)).thenReturn(List.of(p1, p2));
        
        List<Product> result = service.getProducts(tenantId);
        
        assertEquals(2, result.size());
    }
    
    @Test
    void createProduct_shouldSaveProduct() {
        Product product = new Product();
        product.setName("New Product");
        product.setQuantity(10);
        
        when(productRepository.save(product)).thenReturn(product);
        
        Product result = service.createProduct(product);
        
        assertNotNull(result);
        verify(productRepository).save(product);
    }
    
    @Test
    void getCategories_shouldReturnCategoriesByTenant() {
        UUID tenantId = UUID.randomUUID();
        Category c1 = new Category(); c1.setName("Category 1");
        
        when(categoryRepository.findByTenantId(tenantId)).thenReturn(List.of(c1));
        
        List<Category> result = service.getCategories(tenantId);
        
        assertEquals(1, result.size());
    }
    
    @Test
    void createSale_shouldSaveSale() {
        Sale sale = new Sale();
        sale.setQuantity(5);
        
        when(saleRepository.save(sale)).thenReturn(sale);
        
        Sale result = service.createSale(sale);
        
        assertNotNull(result);
        verify(saleRepository).save(sale);
    }
}