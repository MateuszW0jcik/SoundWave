package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findBrandByName(String name);
    boolean existsBrandByName(String name);
}
