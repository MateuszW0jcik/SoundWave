package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Order;
import org.example.soundwave.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findOrdersByUser(User user);
}
