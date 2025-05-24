package org.example.soundwave.model.dto;

import lombok.*;
import org.example.soundwave.model.entity.Product;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private String typeName;
    private String brandName;
    private Boolean wireless;
    private BigDecimal price;
    private Integer quantity;
    private Instant addedAt;

    public ProductDTO(Product product) {
        id = product.getId();
        name = product.getName();
        typeName = product.getType().getName();
        brandName = product.getBrand().getName();
        description = product.getDescription();
        wireless = product.getWireless();
        price = product.getPrice();
        quantity = product.getQuantity();
        addedAt = product.getAddedAt();
    }
}
