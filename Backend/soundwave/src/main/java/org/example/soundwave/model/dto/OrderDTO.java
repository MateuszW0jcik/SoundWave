package org.example.soundwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.soundwave.model.entity.Order;
import org.example.soundwave.model.entity.PaymentMethod;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private BigDecimal totalPrice;
    private PaymentMethod paymentMethod;
    private String owner;
    private Instant placedOn;

    public OrderDTO(Order order){
        id = order.getId();
        totalPrice = order.getTotalPrice();
        paymentMethod = order.getPaymentMethod();
        owner = order.getUser().getFirstName() + " " + order.getUser().getLastName() + " (" + order.getUser().getEmail() + ")";
        placedOn = order.getPlacedOn();
    }
}
