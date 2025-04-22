package org.example.soundwave.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order")
    private Set<OrderedItem> orderedItems = new HashSet<>();

    private BigDecimal totalPrice;

    private PaymentMethod paymentMethod;

    private String country;

    private String postalCode;

    private String city;

    private String street;

    private String streetNumber;

    private String email;

    private String phoneNumber;

    private LocalDateTime placedOn;

    public void addOrderedItem(OrderedItem orderedItem){
        orderedItems.add(orderedItem);
        orderedItem.setOrder(this);
    }
}
