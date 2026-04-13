package com.quinicastock.inventory.service; import com.quinicastock.inventory.repository.*; import com.quinicastock.common.lib.entity.*; import org.springframework.stereotype.*; import java.util.List; import java.util.UUID; @Service public class InventoryService {
    private final ProductRepository productRepository; private final CategoryRepository categoryRepository; private final SaleRepository saleRepository; private final SupplierRepository supplierRepository;
    public InventoryService(ProductRepository pr, CategoryRepository cr, SaleRepository sr, SupplierRepository supr) { this.productRepository = pr; this.categoryRepository = cr; this.saleRepository = sr; this.supplierRepository = supr; }
    public List<Product> getProducts(UUID tenantId) { return productRepository.findByTenantId(tenantId); }
    public Product createProduct(Product p) { return productRepository.save(p); }
    public List<Category> getCategories(UUID tenantId) { return categoryRepository.findByTenantId(tenantId); }
    public Category createCategory(Category c) { return categoryRepository.save(c); }
    public List<Sale> getSales(UUID tenantId) { return saleRepository.findByTenantId(tenantId); }
    public Sale createSale(Sale s) { return saleRepository.save(s); }
    public List<Supplier> getSuppliers(UUID tenantId) { return supplierRepository.findByTenantId(tenantId); }
    public Supplier createSupplier(Supplier s) { return supplierRepository.save(s); }
}