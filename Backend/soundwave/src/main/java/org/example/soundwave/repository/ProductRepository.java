package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.entity.Type;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findProductByName(String name);
    boolean existsProductByName(String name);

    Page<Product> findByType(Type type, Pageable pageable);

    Page<Product> findByBrandId(Long brandId, Pageable pageable);

    Page<Product> findByWireless(Boolean wireless, Pageable pageable);

    Page<Product> findByTypeAndBrandId(Type type, Long brandId, Pageable pageable);

    Page<Product> findByTypeAndWireless(Type type, Boolean wireless, Pageable pageable);

    Page<Product> findByBrandIdAndWireless(Long brandId, Boolean wireless, Pageable pageable);

    Page<Product> findByTypeAndBrandIdAndWireless(Type type, Long brandId, Boolean wireless, Pageable pageable);
}
