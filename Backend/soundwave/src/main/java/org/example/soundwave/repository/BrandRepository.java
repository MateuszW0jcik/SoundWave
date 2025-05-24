package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findBrandByName(String name);

    Page<Brand> findByNameContainingIgnoreCase(String name, Pageable pageable);

    boolean existsBrandByName(String name);

    Optional<Brand> findBrandById(Long id);
}
