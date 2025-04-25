package org.example.soundwave.model.request;

import lombok.Getter;
import org.example.soundwave.model.entity.Brand;
import org.example.soundwave.model.entity.Type;

import java.math.BigDecimal;

@Getter
public class AddProductRequest {
    private String name;

    private Type type;

    private String brandName;

    private String imageURL;

    private String description;

    private Boolean wireless;

    private BigDecimal price;

    private Integer quantity;
}
