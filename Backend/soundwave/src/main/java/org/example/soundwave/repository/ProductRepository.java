package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.entity.Type;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findProductByName(String name);
    boolean existsProductByName(String name);

    List<Product> findTop5ByOrderByAddedAtDesc();

    List<Product> findTop5ByOrderByAddedAtAsc();

    Page<Product> findByNameContainingIgnoreCaseAndTypeIdAndBrandIdAndWireless(String name, Long typeId, Long brandId, Boolean wireless, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndTypeIdAndBrandId(String name, Long typeId, Long brandId, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndTypeIdAndWireless(String name, Long typeId, Boolean wireless, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndBrandIdAndWireless(String name, Long brandId, Boolean wireless, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndTypeId(String name, Long typeId, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndBrandId(String name, Long brandId, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndWireless(String name, Boolean wireless, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
