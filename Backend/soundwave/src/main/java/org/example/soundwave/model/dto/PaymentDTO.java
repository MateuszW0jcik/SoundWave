package org.example.soundwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.soundwave.model.entity.Payment;
import org.example.soundwave.model.entity.PaymentMethod;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private PaymentMethod paymentMethod;
    private String lastDigits;
    private LocalDate expirationDate;
    private String email;

    public PaymentDTO(Payment payment){
        id = payment.getId();
        paymentMethod = payment.getPaymentMethod();
        lastDigits = payment.getLastDigits();
        expirationDate = payment.getExpirationDate();
        email = payment.getEmail();
    }
}
