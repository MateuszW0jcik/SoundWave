package org.example.soundwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.soundwave.model.entity.ShoppingCartItem;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingCartItemDTO {
    private Long id;
    private ProductDTO product;
    private Long quantity;

    public ShoppingCartItemDTO(ShoppingCartItem shoppingCartItem){
        id = shoppingCartItem.getId();
        product = new ProductDTO(shoppingCartItem.getProduct());
        quantity = shoppingCartItem.getQuantity();
    }
}
