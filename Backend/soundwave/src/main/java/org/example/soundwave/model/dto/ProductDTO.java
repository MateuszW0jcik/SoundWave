package org.example.soundwave.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.example.soundwave.model.entity.Brand;
import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.entity.Type;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String type;
    private String brandName;
    private String imageURL;
    private String description;
    private Boolean wireless;
    private BigDecimal price;
    private Integer quantity;

    public ProductDTO(Product product) {
        id = product.getId();
        name = product.getName();
        type = product.getType().getName();
        brandName = product.getBrand().getName();
        imageURL = product.getImageURL();
        description = product.getDescription();
        wireless = product.getWireless();
        price = product.getPrice();
        quantity = product.getQuantity();
    }
}
