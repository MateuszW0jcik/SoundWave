package org.example.soundwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.soundwave.model.entity.OrderedItem;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderedItemDTO {
    private String productName;
    private String brandName;
    private BigDecimal price;
    private Long quantity;
    private String imageURL;

    public OrderedItemDTO(OrderedItem orderedItem){
        productName = orderedItem.getProductName();
        brandName = orderedItem.getBrandName();
        price = orderedItem.getPrice();
        quantity = orderedItem.getQuantity();
        imageURL = orderedItem.getImageURL();
    }
}
