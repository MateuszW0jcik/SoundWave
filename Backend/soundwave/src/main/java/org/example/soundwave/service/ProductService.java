package org.example.soundwave.service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.entity.Brand;
import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.exception.BrandException;
import org.example.soundwave.model.request.AddProductRequest;
import org.example.soundwave.model.dto.ProductDTO;
import org.example.soundwave.repository.BrandRepository;
import org.example.soundwave.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductService {
    private ProductRepository productRepository;
    private BrandRepository brandRepository;

    public void addProduct(ProductDTO productAddRequest) {
        Product product = Product.builder()
                .name(productAddRequest.getName())
                .price(productAddRequest.getPrice())
                .description(productAddRequest.getDescription())
                .quantity(productAddRequest.getQuantity())
                .wireless(productAddRequest.getWireless())
                .type(productAddRequest.getType())
                .imageURL(productAddRequest.getImageURL())
                .addedAt(Instant.now()).build();

        Optional<Brand> brand = brandRepository.findBrandByName(productAddRequest.getBrandName());
        brand.ifPresentOrElse(
                product::setBrand,
                () -> {
                    throw new BrandException("Brand not found: " + productAddRequest.getBrandName());
                }
        );

        productRepository.save(product);
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
    }
}
