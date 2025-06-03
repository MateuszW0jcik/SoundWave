package org.example.soundwave.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.ShoppingCartItemDTO;
import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.entity.ShoppingCartItem;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.exception.ShoppingCartItemException;
import org.example.soundwave.model.request.ShoppingCartItemRequest;
import org.example.soundwave.repository.ShoppingCartItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShoppingCartItemService {
    private final ShoppingCartItemRepository shoppingCartItemRepository;
    private final ProductService productService;

    @Transactional
    public List<ShoppingCartItemDTO> getUserShoppingCartItemsDTO(User user) {
        return shoppingCartItemRepository.findShoppingCartItemsByUserOrderByIdAsc(user)
                .stream()
                .map(ShoppingCartItemDTO::new)
                .collect(Collectors.toList());
    }

    public List<ShoppingCartItem> getUserShoppingCartItems(User user) {
        return shoppingCartItemRepository.findShoppingCartItemsByUserOrderByIdAsc(user);
    }

    @Transactional
    public void addUserShoppingCartItem(ShoppingCartItemRequest request, User user) {
        Product product = productService.findProductById(request.productId());
        if (existsShoppingCartItemByProductAndUser(product, user)) {
            ShoppingCartItem shoppingCartItem = findShoppingCartItemByProductAndUser(product, user);
            shoppingCartItem.setQuantity(shoppingCartItem.getQuantity() + request.quantity());
            saveShoppingCartItem(shoppingCartItem);
        } else {
            ShoppingCartItem shoppingCartItem = ShoppingCartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.quantity())
                    .build();
            saveShoppingCartItem(shoppingCartItem);
        }
    }

    public void deleteUserShoppingCartItem(Long id, User user) {
        ShoppingCartItem shoppingCartItem = findShoppingCartItemById(id);

        if (!shoppingCartItem.getUser().equals(user)) {
            throw new ShoppingCartItemException("User do not contains this shopping cart item");
        }

        deleteShoppingCartItem(shoppingCartItem);
    }

    private void deleteShoppingCartItem(ShoppingCartItem shoppingCartItem){
        shoppingCartItemRepository.delete(shoppingCartItem);
    }

    private ShoppingCartItem findShoppingCartItemById(Long id) {
        return shoppingCartItemRepository.findById(id)
                .orElseThrow(() -> new ShoppingCartItemException("Shopping cart item with id: " + id + " do not exist"));
    }

    public boolean existsShoppingCartItemByProductAndUser(Product product, User user) {
        return shoppingCartItemRepository.existsShoppingCartItemByProductAndUser(product, user);
    }

    public ShoppingCartItem findShoppingCartItemByProductAndUser(Product product, User user) {
        return shoppingCartItemRepository.findShoppingCartItemByProductAndUser(product, user)
                .orElseThrow(() -> new ShoppingCartItemException(
                        "Shopping cart item with product: " + product.getName() + " for user do not exist"));
    }

    public void saveShoppingCartItem(ShoppingCartItem shoppingCartItem) {
        shoppingCartItemRepository.save(shoppingCartItem);
    }

    public void clearUserShoppingCart(User user) {
        List<ShoppingCartItem> shoppingCartItems = getUserShoppingCartItems(user);
        for(ShoppingCartItem shoppingCartItem : shoppingCartItems){
            deleteShoppingCartItem(shoppingCartItem);
        }
    }

    public void updateUserShoppingCartItem(Long id, Long newQuantity, User user) {
        ShoppingCartItem shoppingCartItem = findShoppingCartItemById(id);

        if (!shoppingCartItem.getUser().equals(user)) {
            throw new ShoppingCartItemException("User do not contains this shopping cart item");
        }

        shoppingCartItem.setQuantity(newQuantity);
        saveShoppingCartItem(shoppingCartItem);
    }
}
