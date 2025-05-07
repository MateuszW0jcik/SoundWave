package org.example.soundwave.service;

import lombok.AllArgsConstructor;
import org.example.soundwave.model.dto.BrandDTO;
import org.example.soundwave.model.dto.ProductDTO;
import org.example.soundwave.model.entity.Brand;
import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.exception.BrandException;
import org.example.soundwave.model.request.BrandRequest;
import org.example.soundwave.model.response.PageResponse;
import org.example.soundwave.repository.BrandRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BrandService {
    private final BrandRepository brandRepository;

    public void addBrand(BrandRequest request) {
        if (brandRepository.existsBrandByName(request.brandName())) {
            throw new BrandException("Brand with name: " + request.brandName() + " already exist");
        }

        Brand brand = Brand.builder()
                .name(request.brandName()).build();

        brandRepository.save(brand);
    }

    public void editBrand(Long id, BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new BrandException("Brand with id: " + id + " do not exist"));

        brand.setName(request.brandName());

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

    public PageResponse<BrandDTO> getBrands(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Brand> brands = brandRepository.findAll(pageable);

        List<BrandDTO> content = brands.getContent()
                .stream()
                .map(BrandDTO::new)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                brands.getNumber(),
                brands.getSize(),
                brands.getTotalElements(),
                brands.getTotalPages(),
                brands.isLast());
    }
}
