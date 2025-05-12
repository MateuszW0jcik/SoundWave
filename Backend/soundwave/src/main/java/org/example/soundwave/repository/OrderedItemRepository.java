package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Order;
import org.example.soundwave.model.entity.OrderedItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderedItemRepository extends JpaRepository<OrderedItem, Long> {
    List<OrderedItem> findOrderedItemsByOrder(Order order);
}
