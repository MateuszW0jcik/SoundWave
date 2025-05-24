package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Brand;
import org.example.soundwave.model.entity.ShippingMethod;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShippingMethodRepository extends JpaRepository<ShippingMethod, Long> {
    Optional<ShippingMethod> findShippingMethodById(Long id);

    Page<ShippingMethod> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
