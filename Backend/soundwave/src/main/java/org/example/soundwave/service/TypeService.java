package org.example.soundwave.service;

import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.TypeDTO;
import org.example.soundwave.model.entity.Type;
import org.example.soundwave.model.exception.TypeException;
import org.example.soundwave.model.request.TypeRequest;
import org.example.soundwave.repository.TypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TypeService {
    private final TypeRepository typeRepository;

    public Type findTypeById(Long id){
        return typeRepository.findTypeById(id)
                .orElseThrow(() -> new TypeException("Type with id: " + id + " do not exist"));
    }

    public List<TypeDTO> getTypes() {
        return typeRepository.findAll()
                .stream()
                .map(TypeDTO::new)
                .collect(Collectors.toList());
    }

    public void addType(TypeRequest request) {
        Type type = Type.builder()
                .name(request.name()).build();

        typeRepository.save(type);
    }

    public void editType(Long id, TypeRequest request) {
        Type type = findTypeById(id);

        type.setName(request.name());

        typeRepository.save(type);
    }

    public void deleteType(Long id) {
        Type type = findTypeById(id);

        typeRepository.delete(type);
    }

}
