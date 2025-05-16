package org.example.soundwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.soundwave.model.entity.ShippingMethod;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShippingMethodDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;

    public ShippingMethodDTO(ShippingMethod shippingMethod){
        id = shippingMethod.getId();
        name = shippingMethod.getName();
        description = shippingMethod.getDescription();
        price = shippingMethod.getPrice();
    }
}
