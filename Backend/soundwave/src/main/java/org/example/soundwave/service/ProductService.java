package org.example.soundwave.service;

import lombok.AllArgsConstructor;
import org.example.soundwave.model.entity.Brand;
import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.dto.ProductDTO;
import org.example.soundwave.model.entity.Type;
import org.example.soundwave.model.exception.ProductException;
import org.example.soundwave.model.request.ProductRequest;
import org.example.soundwave.model.response.PageResponse;
import org.example.soundwave.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final BrandService brandService;
    private final TypeService typeService;

    public void addProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.name())
                .price(request.price())
                .description(request.description())
                .quantity(request.quantity())
                .wireless(request.wireless())
                .imageURL(request.imageURL())
                .addedAt(Instant.now()).build();

        Brand brand = brandService.findBrandById(request.brandId());

        Type type = typeService.findTypeById(request.typeId());

        product.setBrand(brand);
        product.setType(type);

        productRepository.save(product);
    }

    public void editProduct(Long id, ProductRequest request) {
        Product product = findProductById(id);

        Brand brand = brandService.findBrandById(request.brandId());
        Type type = typeService.findTypeById(request.typeId());

        product.setName(request.name());
        product.setType(type);
        product.setBrand(brand);
        product.setImageURL(request.imageURL());
        product.setDescription(request.description());
        product.setWireless(request.wireless());
        product.setPrice(request.price());
        product.setQuantity(request.quantity());

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

    public PageResponse<ProductDTO> getProducts(int pageNo, int pageSize, String sortBy, String sortDir,
                                                String name, List<Long> typeIds, List<Long> brandIds, Boolean wireless,
                                                BigDecimal minPrice, BigDecimal maxPrice) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Product> products;

        name = name.trim();

        if (typeIds != null && !typeIds.isEmpty() && brandIds != null && !brandIds.isEmpty()) {
            if (wireless != null && minPrice != null && maxPrice != null) {
                products = productRepository.findByNameContainingIgnoreCaseAndTypeIdInAndBrandIdInAndWirelessAndPriceBetween(
                        name, typeIds, brandIds, wireless, minPrice, maxPrice, pageable);
            } else if (wireless != null) {
                products = productRepository.findByNameContainingIgnoreCaseAndTypeIdInAndBrandIdInAndWireless(
                        name, typeIds, brandIds, wireless, pageable);
            } else if (minPrice != null && maxPrice != null) {
                products = productRepository.findByNameContainingIgnoreCaseAndTypeIdInAndBrandIdInAndPriceBetween(
                        name, typeIds, brandIds, minPrice, maxPrice, pageable);
            } else {
                products = productRepository.findByNameContainingIgnoreCaseAndTypeIdInAndBrandIdIn(
                        name, typeIds, brandIds, pageable);
            }
        } else if (typeIds != null && !typeIds.isEmpty()) {
            if (wireless != null && minPrice != null && maxPrice != null) {
                products = productRepository.findByNameContainingIgnoreCaseAndTypeIdInAndWirelessAndPriceBetween(
                        name, typeIds, wireless, minPrice, maxPrice, pageable);
            } else if (wireless != null) {
                products = productRepository.findByNameContainingIgnoreCaseAndTypeIdInAndWireless(
                        name, typeIds, wireless, pageable);
            } else if (minPrice != null && maxPrice != null) {
                products = productRepository.findByNameContainingIgnoreCaseAndTypeIdInAndPriceBetween(
                        name, typeIds, minPrice, maxPrice, pageable);
            } else {
                products = productRepository.findByNameContainingIgnoreCaseAndTypeIdIn(name, typeIds, pageable);
            }
        } else if (brandIds != null && !brandIds.isEmpty()) {
            if (wireless != null && minPrice != null && maxPrice != null) {
                products = productRepository.findByNameContainingIgnoreCaseAndBrandIdInAndWirelessAndPriceBetween(
                        name, brandIds, wireless, minPrice, maxPrice, pageable);
            } else if (wireless != null) {
                products = productRepository.findByNameContainingIgnoreCaseAndBrandIdInAndWireless(
                        name, brandIds, wireless, pageable);
            } else if (minPrice != null && maxPrice != null) {
                products = productRepository.findByNameContainingIgnoreCaseAndBrandIdInAndPriceBetween(
                        name, brandIds, minPrice, maxPrice, pageable);
            } else {
                products = productRepository.findByNameContainingIgnoreCaseAndBrandIdIn(name, brandIds, pageable);
            }
        } else {
            if (wireless != null && minPrice != null && maxPrice != null) {
                products = productRepository.findByNameContainingIgnoreCaseAndWirelessAndPriceBetween(
                        name, wireless, minPrice, maxPrice, pageable);
            } else if (wireless != null) {
                products = productRepository.findByNameContainingIgnoreCaseAndWireless(name, wireless, pageable);
            } else if (minPrice != null && maxPrice != null) {
                products = productRepository.findByNameContainingIgnoreCaseAndPriceBetween(
                        name, minPrice, maxPrice, pageable);
            } else {
                products = productRepository.findByNameContainingIgnoreCase(name, pageable);
            }
        }

        List<ProductDTO> content = products.getContent()
                .stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                products.getNumber(),
                products.getSize(),
                products.getTotalElements(),
                products.getTotalPages(),
                products.isLast());
    }



    public List<ProductDTO> getNewProducts() {
        List<Product> products = productRepository.findTop8ByOrderByAddedAtDesc();

        return products
                .stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getBestSellersProducts() {
        List<Product> products = productRepository.findTop8ByOrderByAddedAtAsc();

        return products
                .stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        return new ProductDTO(findProductById(id));
    }
}
