package org.example.soundwave.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Type type;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    private String imageURL;

    private String description;

    private Boolean wireless;

    private BigDecimal price;

    private Integer quantity;

    private LocalDateTime addedAt;

    public void setBrand(Brand brand){
        this.brand = brand;
        brand.getProducts().add(this);
    }
}
