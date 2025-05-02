package org.example.soundwave.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.example.soundwave.model.entity.Brand;

@Data
public class BrandDTO {
    @NotBlank
    @Size(max = 50)
    private String brandName;

    public BrandDTO(Brand brand){brandName = brand.getName();}
}
