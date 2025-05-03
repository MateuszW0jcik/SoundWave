package org.example.soundwave.model.dto;

import lombok.Builder;
import lombok.Data;
import org.example.soundwave.model.entity.Brand;
import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.entity.Type;

import java.math.BigDecimal;

@Data
public class ProductDTO {
    private String name;
    private Type type;
    private String brandName;
    private String imageURL;
    private String description;
    private Boolean wireless;
    private BigDecimal price;
    private Integer quantity;

    public ProductDTO(Product product) {
        this.name = product.getName();
        this.type = product.getType();
        this.brandName = product.getBrand().getName();
        this.imageURL = product.getImageURL();
        this.description = product.getDescription();
        this.wireless = product.getWireless();
        this.price = product.getPrice();
        this.quantity = product.getQuantity();
    }
}
