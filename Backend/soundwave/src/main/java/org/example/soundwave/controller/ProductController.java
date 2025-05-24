package org.example.soundwave.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.ProductDTO;
import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.request.ProductRequest;
import org.example.soundwave.model.response.PageResponse;
import org.example.soundwave.service.ProductService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Tag(name = "Product")
@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<PageResponse<ProductDTO>> getProducts(
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "10", required = false) int size,
            @RequestParam(value = "sortBy", defaultValue = "name", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir,
            @RequestParam(value = "name", defaultValue = "", required = false) String name,
            @RequestParam(value = "typeId", required = false) List<Long> typeIds,
            @RequestParam(value = "brandId", required = false) List<Long> brandIds,
            @RequestParam(value = "wireless", required = false) Boolean wireless,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice) {
        return ResponseEntity.ok(productService.getProducts(page, size, sortBy, sortDir, name, typeIds, brandIds, wireless, minPrice, maxPrice));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id){
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable Long id){
        Product product = productService.findProductById(id);
        byte[] image = product.getImageData();

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(product.getImageType()))
                .body(image);
    }

    @GetMapping("/new")
    public ResponseEntity<List<ProductDTO>> getNewProducts(){
        return ResponseEntity.ok(productService.getNewProducts());
    }

    @GetMapping("/best")
    public ResponseEntity<List<ProductDTO>> getBestSellersProducts(){
        return ResponseEntity.ok(productService.getBestSellersProducts());
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addProduct(@Valid @RequestPart("request") ProductRequest request,
                                        @RequestPart("image") MultipartFile image) {
        productService.addProduct(request, image);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editProduct(@PathVariable Long id,
                                         @Valid @RequestPart("request") ProductRequest request,
                                         @RequestPart(value = "image", required = false) MultipartFile image) {
        productService.editProduct(id, request, image);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
