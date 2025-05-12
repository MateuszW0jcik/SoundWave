package org.example.soundwave.service;

import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.entity.Order;
import org.example.soundwave.model.entity.OrderedItem;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.repository.OrderedItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderedItemService {
    private final OrderedItemRepository orderedItemRepository;

    public void saveOrderedItem(OrderedItem orderedItem) {
        orderedItemRepository.save(orderedItem);
    }

    public List<OrderedItem> findOrderedItemsByOrder(Order order) {
        return orderedItemRepository.findOrderedItemsByOrder(order);
    }
}
