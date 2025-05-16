package org.example.soundwave.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.ShippingMethodDTO;
import org.example.soundwave.model.request.ShippingMethodRequest;
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

    @GetMapping
    public ResponseEntity<List<ShippingMethodDTO>> getShippingMethods(){
        return ResponseEntity.ok(shippingMethodService.getShippingMethods());
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
