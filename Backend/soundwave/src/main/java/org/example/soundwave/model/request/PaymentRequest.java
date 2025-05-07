package org.example.soundwave.model.request;

import jakarta.validation.constraints.*;
import org.example.soundwave.model.entity.PaymentMethod;

import java.time.LocalDate;

public record PaymentRequest(
        @NotNull(message = "Payment method is required")
        PaymentMethod paymentMethod,
        @Pattern(regexp = "\\d{4}", message = "Last digits must be a 4 digits")
        String lastDigits,

        @Future(message = "Expiration date must be in the future")
        LocalDate expirationDate,
        @Email(message = "Email should be valid")
        String email
) {
}
