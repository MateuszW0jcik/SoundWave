package org.example.soundwave.service;

import lombok.AllArgsConstructor;
import org.example.soundwave.model.dto.BrandDTO;
import org.example.soundwave.model.dto.ProductDTO;
import org.example.soundwave.model.entity.Brand;
import org.example.soundwave.model.exception.BrandException;
import org.example.soundwave.model.request.AddBrandRequest;
import org.example.soundwave.repository.BrandRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BrandService {
    private BrandRepository brandRepository;

    public void addBrand(AddBrandRequest brandAddRequest){
        if(brandRepository.existsBrandByName(brandAddRequest.getBrandName())){
            throw new BrandException("Brand " + brandAddRequest.getBrandName() + " exist");
        }

        Brand brand = Brand.builder()
                .name(brandAddRequest.getBrandName()).build();

        brandRepository.save(brand);
    }

    public List<BrandDTO> getAllBrands(){
        return brandRepository.findAll()
                .stream()
                .map(BrandDTO::new)
                .collect(Collectors.toList());
    }
}
