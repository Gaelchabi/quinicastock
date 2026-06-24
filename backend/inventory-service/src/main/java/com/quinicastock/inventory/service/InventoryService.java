package com.quinicastock.inventory.service;

import com.quinicastock.inventory.repository.*;
import com.quinicastock.common.lib.entity.*;
import org.springframework.stereotype.*;
import java.util.List;
import java.util.UUID;

@Service
public class InventoryService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SaleRepository saleRepository;
    private final SupplierRepository supplierRepository;

    public InventoryService(ProductRepository pr, CategoryRepository cr, SaleRepository sr, SupplierRepository supr) {
        this.productRepository = pr;
        this.categoryRepository = cr;
        this.saleRepository = sr;
        this.supplierRepository = supr;
    }

    public List<Product> getProducts(UUID tenantId) {
        return productRepository.findByTenantId(tenantId);
    }

    public Product createProduct(Product p) {
        return productRepository.save(p);
    }

    public Product updateProduct(Product p) {
        return productRepository.save(p);
    }

    public void deleteProduct(UUID id) {
        productRepository.deleteById(id);
    }

    public List<Category> getCategories(UUID tenantId) {
        return categoryRepository.findByTenantId(tenantId);
    }

    public Category createCategory(Category c) {
        return categoryRepository.save(c);
    }

    public Category updateCategory(Category c) {
        return categoryRepository.save(c);
    }

    public void deleteCategory(UUID id) {
        categoryRepository.deleteById(id);
    }

    public List<Sale> getSales(UUID tenantId) {
        return saleRepository.findByTenantId(tenantId);
    }

    public Sale createSale(Sale s) {
        return saleRepository.save(s);
    }

    public List<Supplier> getSuppliers(UUID tenantId) {
        return supplierRepository.findByTenantId(tenantId);
    }

    public Supplier createSupplier(Supplier s) {
        return supplierRepository.save(s);
    }

    public Supplier updateSupplier(Supplier s) {
        return supplierRepository.save(s);
    }

    public void deleteSupplier(UUID id) {
        supplierRepository.deleteById(id);
    }
}
