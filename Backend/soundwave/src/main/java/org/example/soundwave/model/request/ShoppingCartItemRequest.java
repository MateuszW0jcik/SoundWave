package org.example.soundwave.model.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ShoppingCartItemRequest(
        @NotNull(message = "productId can't be null")
        Long productId,
        @NotNull(message = "productDTO can't be null")
        @Min(value = 1, message = "quantity must be greater then 0")
        Long quantity
) {
}
