package org.example.soundwave.service;

import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.ShippingMethodDTO;
import org.example.soundwave.model.entity.ShippingMethod;
import org.example.soundwave.model.exception.ShippingMethodException;
import org.example.soundwave.model.request.ShippingMethodRequest;
import org.example.soundwave.repository.ShippingMethodRepository;
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

    public List<ShippingMethodDTO> getShippingMethods() {
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
