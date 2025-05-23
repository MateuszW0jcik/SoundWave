package org.example.soundwave.model.dto;

import lombok.*;
import org.example.soundwave.model.entity.Brand;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrandDTO {
    private Long id;
    private String name;

    public BrandDTO(Brand brand) {
        id = brand.getId();
        name = brand.getName();
    }
}
