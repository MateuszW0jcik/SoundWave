package org.example.soundwave.service;

import lombok.AllArgsConstructor;
import org.example.soundwave.config.PaginationProperties;
import org.example.soundwave.model.dto.BrandDTO;
import org.example.soundwave.model.entity.Brand;
import org.example.soundwave.model.exception.BrandException;
import org.example.soundwave.repository.BrandRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BrandService {
    private final BrandRepository brandRepository;
    private final PaginationProperties paginationProperties;

    public void addBrand(BrandDTO brandDTO) {
        if (brandRepository.existsBrandByName(brandDTO.getBrandName())) {
            throw new BrandException("Brand " + brandDTO.getBrandName() + " exist");
        }

        Brand brand = Brand.builder()
                .name(brandDTO.getBrandName()).build();

        brandRepository.save(brand);
    }

    public List<BrandDTO> getAllBrands() {
        return brandRepository.findAll()
                .stream()
                .map(BrandDTO::new)
                .collect(Collectors.toList());
    }

    public List<BrandDTO> getBrandsByPage(Integer page) {
        Pageable pageable = PageRequest.of(page, paginationProperties.getDefaultPageSize());
        return brandRepository.findAll(pageable)
                .stream()
                .map(BrandDTO::new)
                .collect(Collectors.toList());
    }

    public void editBrand(Long id, BrandDTO request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new BrandException("Brand with " + id + " do not exist"));

        brand.setName(request.getBrandName());

        brandRepository.save(brand);
    }

    public void deleteBrand(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new BrandException("Brand with " + id + " do not exist"));

         brandRepository.delete(brand);
    }

    public Brand findBrandByName(String name){
        return brandRepository.findBrandByName(name)
                .orElseThrow(() -> new BrandException("Brand with name: " + name + " do not exist"));
    }
}
