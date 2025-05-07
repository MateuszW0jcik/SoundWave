package org.example.soundwave.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.BrandDTO;
import org.example.soundwave.model.request.BrandRequest;
import org.example.soundwave.service.BrandService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/brand")
@RequiredArgsConstructor
public class BrandController {
    private final BrandService brandService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addBrand(@Valid @RequestBody BrandRequest request) {
        brandService.addBrand(request);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editBrand(@PathVariable Long id, @Valid @RequestBody BrandRequest request) {
        brandService.editBrand(id, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<BrandDTO>> getBrands(@PageableDefault(size = 20) Pageable pageable) {
        if (pageable.getSort().isUnsorted() || pageable.getSort().toString().equals("[]")) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        }
        return ResponseEntity.ok(brandService.getBrands(pageable));
    }
}
