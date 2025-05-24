package org.example.soundwave.service;

import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.ShippingMethodDTO;
import org.example.soundwave.model.entity.ShippingMethod;
import org.example.soundwave.model.exception.ShippingMethodException;
import org.example.soundwave.model.request.ShippingMethodRequest;
import org.example.soundwave.model.response.PageResponse;
import org.example.soundwave.repository.ShippingMethodRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShippingMethodService {
    private final ShippingMethodRepository shippingMethodRepository;

    public ShippingMethod findShippingMethodById(Long id){
        return shippingMethodRepository.findShippingMethodById(id)
                .orElseThrow(() -> new ShippingMethodException("Shipping method with id: " + id + " do not exist"));
    }

    public PageResponse<ShippingMethodDTO> getShippingMethods(int pageNo, int pageSize, String sortBy, String sortDir, String name) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<ShippingMethod> shippingMethods = shippingMethodRepository.findByNameContainingIgnoreCase(name, pageable);

        List<ShippingMethodDTO> content = shippingMethods.getContent()
                .stream()
                .map(ShippingMethodDTO::new)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                shippingMethods.getNumber(),
                shippingMethods.getSize(),
                shippingMethods.getTotalElements(),
                shippingMethods.getTotalPages(),
                shippingMethods.isLast());
    }

    public List<ShippingMethodDTO> getAllShippingMethods() {
        return shippingMethodRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(ShippingMethod::getPrice).reversed())
                .map(ShippingMethodDTO::new)
                .collect(Collectors.toList());
    }

    public void addShippingMethod(ShippingMethodRequest request) {
        ShippingMethod shippingMethod = ShippingMethod.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price()).build();

        shippingMethodRepository.save(shippingMethod);
    }

    public void editShippingMethod(Long id, ShippingMethodRequest request) {
        ShippingMethod shippingMethod = findShippingMethodById(id);

        shippingMethod.setName(request.name());
        shippingMethod.setDescription(request.description());
        shippingMethod.setPrice(request.price());

        shippingMethodRepository.save(shippingMethod);
    }

    public void deleteShippingMethod(Long id) {
        ShippingMethod shippingMethod = findShippingMethodById(id);

        shippingMethodRepository.delete(shippingMethod);
    }
}
