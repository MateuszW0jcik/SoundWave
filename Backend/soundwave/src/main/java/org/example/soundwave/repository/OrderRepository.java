package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Order;
import org.example.soundwave.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findOrdersByUser(User user, Pageable pageable);

    Page<Order> findByUserIn(List<User> users, Pageable pageable);
}
