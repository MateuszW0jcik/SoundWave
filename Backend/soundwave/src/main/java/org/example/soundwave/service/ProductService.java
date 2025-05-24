package org.example.soundwave.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
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
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final BrandService brandService;
    private final TypeService typeService;
    @PersistenceContext
    private EntityManager entityManager;

    public void addProduct(ProductRequest request, MultipartFile image) {
        Product product = Product.builder()
                .name(request.name())
                .price(request.price())
                .description(request.description())
                .quantity(request.quantity())
                .wireless(request.wireless())
                .addedAt(Instant.now()).build();

        Brand brand = brandService.findBrandByName(request.brandName());

        Type type = typeService.findTypeByName(request.typeName());

        product.setBrand(brand);
        product.setType(type);

        product.setImageType(image.getContentType());
        try {
            product.setImageData(image.getBytes());
        } catch (Exception e) {
            throw new ProductException("Failed to store image");
        }

        productRepository.save(product);
    }

    public void editProduct(Long id, ProductRequest request, MultipartFile image) {
        Product product = findProductById(id);

        Brand brand = brandService.findBrandByName(request.brandName());
        Type type = typeService.findTypeByName(request.typeName());

        product.setName(request.name());
        product.setType(type);
        product.setBrand(brand);
        product.setDescription(request.description());
        product.setWireless(request.wireless());
        product.setPrice(request.price());
        product.setQuantity(request.quantity());
        if (image != null) {
            product.setImageType(image.getContentType());
            try {
                product.setImageData(image.getBytes());
            } catch (Exception e) {
                throw new ProductException("Failed to store image");
            }
        }

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
        StringBuilder jpql = new StringBuilder();
        jpql.append("SELECT new org.example.soundwave.model.dto.ProductDTO(");
        jpql.append("p.id, p.name, p.description, p.type.name, p.brand.name, ");
        jpql.append("p.wireless, p.price, p.quantity, p.addedAt) ");
        jpql.append("FROM Product p WHERE 1=1 ");

        Map<String, Object> parameters = new HashMap<>();

        if (name != null && !name.trim().isEmpty()) {
            jpql.append("AND LOWER(p.name) LIKE LOWER(:name) ");
            parameters.put("name", "%" + name.trim() + "%");
        }

        if (typeIds != null && !typeIds.isEmpty()) {
            jpql.append("AND p.type.id IN :typeIds ");
            parameters.put("typeIds", typeIds);
        }

        if (brandIds != null && !brandIds.isEmpty()) {
            jpql.append("AND p.brand.id IN :brandIds ");
            parameters.put("brandIds", brandIds);
        }

        if (wireless != null) {
            jpql.append("AND p.wireless = :wireless ");
            parameters.put("wireless", wireless);
        }

        if (minPrice != null) {
            jpql.append("AND p.price >= :minPrice ");
            parameters.put("minPrice", minPrice);
        }

        if (maxPrice != null) {
            jpql.append("AND p.price <= :maxPrice ");
            parameters.put("maxPrice", maxPrice);
        }

        jpql.append("ORDER BY p.").append(sortBy).append(" ").append(sortDir.toUpperCase());

        TypedQuery<ProductDTO> query = entityManager.createQuery(jpql.toString(), ProductDTO.class);
        parameters.forEach(query::setParameter);

        query.setFirstResult(pageNo * pageSize);
        query.setMaxResults(pageSize);

        List<ProductDTO> content = query.getResultList();

        String countJpql = jpql.toString()
                .replace("SELECT new org.example.soundwave.model.dto.ProductDTO(p.id, p.name, p.description, p.type.name, p.brand.name, p.wireless, p.price, p.quantity, p.addedAt)", "SELECT COUNT(p)")
                .replaceAll("ORDER BY.*", "");

        TypedQuery<Long> countQuery = entityManager.createQuery(countJpql, Long.class);
        parameters.forEach(countQuery::setParameter);

        Long totalElements = countQuery.getSingleResult();
        int totalPages = (int) Math.ceil((double) totalElements / pageSize);

        return new PageResponse<>(
                content,
                pageNo,
                pageSize,
                totalElements,
                totalPages,
                pageNo >= totalPages - 1);
    }

    public List<ProductDTO> getNewProducts() {
        return productRepository.findRecentProducts(PageRequest.of(0, 8));
    }

    public List<ProductDTO> getBestSellersProducts() {
        return productRepository.findOldestProducts(PageRequest.of(0, 8));

    }

    public ProductDTO getProductById(Long id) {
        return new ProductDTO(findProductById(id));
    }
}
