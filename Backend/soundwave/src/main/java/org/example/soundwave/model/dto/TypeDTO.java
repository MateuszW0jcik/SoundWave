package org.example.soundwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.soundwave.model.entity.Type;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TypeDTO {
    private Long id;
    private String name;

    public TypeDTO(Type type) {
        id = type.getId();
        name = type.getName();
    }
}
