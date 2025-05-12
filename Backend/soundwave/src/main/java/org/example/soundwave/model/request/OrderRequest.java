package org.example.soundwave.model.request;

import jakarta.validation.constraints.NotNull;
import org.example.soundwave.model.entity.PaymentMethod;
import org.example.soundwave.model.entity.ShippingMethod;

public record OrderRequest(
        @NotNull(message = "Address id can't be null")
        Long addressId,
        @NotNull(message = "Contact id can't be null")
        Long contactId,
        @NotNull(message = "Payment id can't be null")
        Long paymentId,
        @NotNull(message = "Shipping method can't be null")
        ShippingMethod shippingMethod
) {
}
