package org.example.soundwave.repository;

import org.example.soundwave.model.dto.ProductDTO;
import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.entity.Type;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findProductByName(String name);
    boolean existsProductByName(String name);

    @Query("""
                SELECT new org.example.soundwave.model.dto.ProductDTO(
                    p.id, p.name, p.description, p.type.name, p.brand.name,
                    p.wireless, p.price, p.quantity, p.addedAt
                )
                FROM Product p
                ORDER BY p.addedAt DESC
            """)
    List<ProductDTO> findRecentProducts(Pageable pageable);

    @Query("""
                SELECT new org.example.soundwave.model.dto.ProductDTO(
                    p.id, p.name, p.description, p.type.name, p.brand.name,
                    p.wireless, p.price, p.quantity, p.addedAt
                )
                FROM Product p
                ORDER BY p.addedAt ASC
            """)
    List<ProductDTO> findOldestProducts(Pageable pageable);

}
