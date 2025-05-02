package org.example.soundwave.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.request.AddProductRequest;
import org.example.soundwave.model.dto.ProductDTO;
import org.example.soundwave.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> addProduct(@Valid @RequestBody AddProductRequest request) {
        productService.addProduct(request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
}
