package org.example.soundwave.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.BrandDTO;
import org.example.soundwave.model.dto.ProductDTO;
import org.example.soundwave.model.request.AddBrandRequest;
import org.example.soundwave.model.request.AddProductRequest;
import org.example.soundwave.service.BrandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brand")
@RequiredArgsConstructor
public class BrandController {
    private final BrandService brandService;

    @PostMapping("/add")
    public ResponseEntity<Void> addBrand(@Valid @RequestBody AddBrandRequest request) {
        brandService.addBrand(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<BrandDTO>> getAllBrands() {
        return ResponseEntity.ok(brandService.getAllBrands());
    }
}
