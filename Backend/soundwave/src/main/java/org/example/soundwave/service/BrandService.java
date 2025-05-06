package org.example.soundwave.service;

import lombok.AllArgsConstructor;
import org.example.soundwave.model.dto.BrandDTO;
import org.example.soundwave.model.entity.Brand;
import org.example.soundwave.model.exception.BrandException;
import org.example.soundwave.repository.BrandRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class BrandService {
    private final BrandRepository brandRepository;

    public void addBrand(BrandDTO brandDTO) {
        if (brandRepository.existsBrandByName(brandDTO.getBrandName())) {
            throw new BrandException("Brand with name: " + brandDTO.getBrandName() + " already exist");
        }

        Brand brand = Brand.builder()
                .name(brandDTO.getBrandName()).build();

        brandRepository.save(brand);
    }

    public void editBrand(Long id, BrandDTO request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new BrandException("Brand with id: " + id + " do not exist"));

        brand.setName(request.getBrandName());

        brandRepository.save(brand);
    }

    public void deleteBrand(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new BrandException("Brand with id: " + id + " do not exist"));

         brandRepository.delete(brand);
    }

    public Brand findBrandByName(String name){
        return brandRepository.findBrandByName(name)
                .orElseThrow(() -> new BrandException("Brand with name: " + name + " do not exist"));
    }

    public Page<BrandDTO> getBrands(Pageable pageable) {
        return brandRepository.findAll(pageable)
                .map(BrandDTO::new);
    }
}
