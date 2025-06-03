package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.entity.ShoppingCartItem;
import org.example.soundwave.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ShoppingCartItemRepository extends JpaRepository<ShoppingCartItem, Long> {
    boolean existsShoppingCartItemByProductAndUser(Product product, User user);

    Optional<ShoppingCartItem> findShoppingCartItemByProductAndUser(Product product, User user);

    List<ShoppingCartItem> findShoppingCartItemsByUserOrderByIdAsc(User user);
}
