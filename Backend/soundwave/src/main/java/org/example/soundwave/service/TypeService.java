package org.example.soundwave.service;

import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.BrandDTO;
import org.example.soundwave.model.dto.TypeDTO;
import org.example.soundwave.model.entity.Brand;
import org.example.soundwave.model.entity.Type;
import org.example.soundwave.model.exception.TypeException;
import org.example.soundwave.model.request.TypeRequest;
import org.example.soundwave.model.response.PageResponse;
import org.example.soundwave.repository.TypeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    public Type findTypeByName(String typeName) {
        return typeRepository.findTypeByName(typeName)
                .orElseThrow(() -> new TypeException("Type with name: " + typeName + " do not exist"));
    }

    public PageResponse<TypeDTO> getTypes(int pageNo, int pageSize, String sortBy, String sortDir, String name) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Type> types = typeRepository.findByNameContainingIgnoreCase(name, pageable);

        List<TypeDTO> content = types.getContent()
                .stream()
                .map(TypeDTO::new)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                types.getNumber(),
                types.getSize(),
                types.getTotalElements(),
                types.getTotalPages(),
                types.isLast());
    }

    public List<TypeDTO> getAllTypes() {
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
