package org.example.soundwave.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.example.soundwave.model.entity.Brand;
import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.entity.Type;

import java.math.BigDecimal;

@Data
public class ProductDTO {
    @NotBlank(message = "Name can't be empty")
    private String name;

    @NotNull(message = "Type can't be null")
    private Type type;

    @NotBlank(message = "Brand name can't be empty")
    private String brandName;

    @NotBlank(message = "Image URL can't be empty")
    private String imageURL;

    @NotBlank(message = "Description can't be empty")
    private String description;

    @NotNull(message = "Wireless can't be null")
    private Boolean wireless;

    @NotBlank(message = "Price can't be empty")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Quantity can't be null")
    @Min(value = 0, message = "Quantity must be zero or greater")
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
