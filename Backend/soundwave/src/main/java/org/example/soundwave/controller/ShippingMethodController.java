package org.example.soundwave.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.BrandDTO;
import org.example.soundwave.model.dto.ShippingMethodDTO;
import org.example.soundwave.model.request.ShippingMethodRequest;
import org.example.soundwave.model.response.PageResponse;
import org.example.soundwave.service.ShippingMethodService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Shipping method")
@RestController
@RequestMapping("/api/shipping_method")
@RequiredArgsConstructor
public class ShippingMethodController {
    private final ShippingMethodService shippingMethodService;

    @GetMapping("/all")
    public ResponseEntity<List<ShippingMethodDTO>> getAllShippingMethods(){
        return ResponseEntity.ok(shippingMethodService.getAllShippingMethods());
    }

    @GetMapping
    public ResponseEntity<PageResponse<ShippingMethodDTO>> getShippingMethods(
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "10", required = false) int size,
            @RequestParam(value = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir,
            @RequestParam(value = "name", defaultValue = "", required = false) String name) {
        return ResponseEntity.ok(shippingMethodService.getShippingMethods(page, size, sortBy, sortDir, name));
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addShippingMethod(@Valid @RequestBody ShippingMethodRequest request) {
        shippingMethodService.addShippingMethod(request);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editShippingMethod(@PathVariable Long id,
                                         @Valid @RequestBody ShippingMethodRequest request) {
        shippingMethodService.editShippingMethod(id, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteShippingMethod(@PathVariable Long id) {
        shippingMethodService.deleteShippingMethod(id);
        return ResponseEntity.noContent().build();
    }
}
