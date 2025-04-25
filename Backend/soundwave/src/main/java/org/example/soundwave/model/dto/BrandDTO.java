package org.example.soundwave.model.dto;

import lombok.Data;
import org.example.soundwave.model.entity.Brand;

@Data
public class BrandDTO {
    private String brandName;

    public BrandDTO(Brand brand){
        brandName = brand.getName();
    }
}
