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
                                                String name, Long typeId, Long brandId, Boolean wireless) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Product> products;

        name = name.trim();

        if (typeId != null && brandId != null && wireless != null) {
            products = productRepository.findByNameContainingIgnoreCaseAndTypeIdAndBrandIdAndWireless(name, typeId, brandId, wireless, pageable);
        } else if (typeId != null && brandId != null) {
            products = productRepository.findByNameContainingIgnoreCaseAndTypeIdAndBrandId(name, typeId, brandId, pageable);
        } else if (typeId != null && wireless != null) {
            products = productRepository.findByNameContainingIgnoreCaseAndTypeIdAndWireless(name, typeId, wireless, pageable);
        } else if (brandId != null && wireless != null) {
            products = productRepository.findByNameContainingIgnoreCaseAndBrandIdAndWireless(name, brandId, wireless, pageable);
        } else if (typeId != null) {
            products = productRepository.findByNameContainingIgnoreCaseAndTypeId(name, typeId, pageable);
        } else if (brandId != null) {
            products = productRepository.findByNameContainingIgnoreCaseAndBrandId(name, brandId, pageable);
        } else if (wireless != null) {
            products = productRepository.findByNameContainingIgnoreCaseAndWireless(name, wireless, pageable);
        } else {
            products = productRepository.findByNameContainingIgnoreCase(name, pageable);
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
        List<Product> products = productRepository.findTop5ByOrderByAddedAtDesc();

        return products
                .stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getBestSellersProducts() {
        List<Product> products = productRepository.findTop5ByOrderByAddedAtDesc();

        return products
                .stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
    }
}
