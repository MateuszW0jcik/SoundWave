package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.entity.Type;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findProductByName(String name);
    boolean existsProductByName(String name);

    List<Product> findTop8ByOrderByAddedAtDesc();

    List<Product> findTop8ByOrderByAddedAtAsc();

    Page<Product> findByNameContainingIgnoreCaseAndTypeIdInAndBrandIdInAndWirelessAndPriceBetween(
            String name, List<Long> typeIds, List<Long> brandIds, Boolean wireless, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndTypeIdInAndBrandIdInAndWireless(
            String name, List<Long> typeIds, List<Long> brandIds, Boolean wireless, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndTypeIdInAndBrandIdInAndPriceBetween(
            String name, List<Long> typeIds, List<Long> brandIds, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndTypeIdInAndBrandIdIn(
            String name, List<Long> typeIds, List<Long> brandIds, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndTypeIdInAndWirelessAndPriceBetween(
            String name, List<Long> typeIds, Boolean wireless, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndTypeIdInAndWireless(
            String name, List<Long> typeIds, Boolean wireless, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndTypeIdInAndPriceBetween(
            String name, List<Long> typeIds, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndTypeIdIn(
            String name, List<Long> typeIds, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndBrandIdInAndWirelessAndPriceBetween(
            String name, List<Long> brandIds, Boolean wireless, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndBrandIdInAndWireless(
            String name, List<Long> brandIds, Boolean wireless, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndBrandIdInAndPriceBetween(
            String name, List<Long> brandIds, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndBrandIdIn(
            String name, List<Long> brandIds, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndWirelessAndPriceBetween(
            String name, Boolean wireless, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndWireless(
            String name, Boolean wireless, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndPriceBetween(
            String name, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCase(
            String name, Pageable pageable);
}
