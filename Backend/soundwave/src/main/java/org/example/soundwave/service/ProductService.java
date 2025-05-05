package org.example.soundwave.service;

import lombok.AllArgsConstructor;
import org.example.soundwave.config.PaginationProperties;
import org.example.soundwave.model.dto.BrandDTO;
import org.example.soundwave.model.entity.Brand;
import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.exception.BrandException;
import org.example.soundwave.model.dto.ProductDTO;
import org.example.soundwave.model.exception.ProductException;
import org.example.soundwave.repository.BrandRepository;
import org.example.soundwave.repository.ProductRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final BrandService brandService;
    private final PaginationProperties paginationProperties;

    public void addProduct(ProductDTO request) {
        Product product = Product.builder()
                .name(request.getName())
                .price(request.getPrice())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .wireless(request.getWireless())
                .type(request.getType())
                .imageURL(request.getImageURL())
                .addedAt(Instant.now()).build();

        Brand brand = brandService.findBrandByName(request.getBrandName());

        product.setBrand(brand);

        productRepository.save(product);
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByPage(Integer page) {
        Pageable pageable = PageRequest.of(page, paginationProperties.getDefaultPageSize());
        return productRepository.findAll(pageable)
                .stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
    }

    public void editProduct(Long id, ProductDTO request) {
        Product product = findProductById(id);

        Brand brand = brandService.findBrandByName(request.getBrandName());

        product.setName(request.getName());
        product.setType(request.getType());
        product.setBrand(brand);
        product.setImageURL(request.getImageURL());
        product.setDescription(request.getDescription());
        product.setWireless(request.getWireless());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());

        productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = findProductById(id);

        productRepository.delete(product);
    }

    public Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductException("Product with id: " + id + " do not exist"));
    }
}
