package org.example.soundwave.model.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.example.soundwave.model.entity.Type;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank(message = "Name can't be empty")
        String name,
        @NotNull(message = "Type can't be null")
        Type type,
        @NotNull(message = "Brand can't be null")
        BrandRequest brand,
        @NotBlank(message = "Image URL can't be empty")
        String imageURL,
        @NotBlank(message = "Description can't be empty")
        String description,
        @NotNull(message = "Wireless can't be null")
        Boolean wireless,
        @NotBlank(message = "Price can't be empty")
        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
        BigDecimal price,
        @NotNull(message = "Quantity can't be null")
        @Min(value = 0, message = "Quantity must be zero or greater")
        Integer quantity
) {
}
