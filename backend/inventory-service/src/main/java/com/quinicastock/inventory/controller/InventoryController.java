package com.quinicastock.inventory.controller; import com.quinicastock.inventory.service.InventoryService; import com.quinicastock.common.lib.entity.*; import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*; import java.util.List; import java.util.UUID; @RestController @RequestMapping("/inventory") public class InventoryController {
    private final InventoryService service;
    public InventoryController(InventoryService service) { this.service = service; }
    @GetMapping("/products") public ResponseEntity<List<Product>> getProducts(@RequestParam UUID tenantId) { return ResponseEntity.ok(service.getProducts(tenantId)); }
    @PostMapping("/products") public ResponseEntity<Product> createProduct(@RequestBody Product p) { return ResponseEntity.ok(service.createProduct(p)); }
    @GetMapping("/categories") public ResponseEntity<List<Category>> getCategories(@RequestParam UUID tenantId) { return ResponseEntity.ok(service.getCategories(tenantId)); }
    @PostMapping("/categories") public ResponseEntity<Category> createCategory(@RequestBody Category c) { return ResponseEntity.ok(service.createCategory(c)); }
    @GetMapping("/sales") public ResponseEntity<List<Sale>> getSales(@RequestParam UUID tenantId) { return ResponseEntity.ok(service.getSales(tenantId)); }
    @PostMapping("/sales") public ResponseEntity<Sale> createSale(@RequestBody Sale s) { return ResponseEntity.ok(service.createSale(s)); }
    @GetMapping("/suppliers") public ResponseEntity<List<Supplier>> getSuppliers(@RequestParam UUID tenantId) { return ResponseEntity.ok(service.getSuppliers(tenantId)); }
    @PostMapping("/suppliers") public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier s) { return ResponseEntity.ok(service.createSupplier(s)); }
}