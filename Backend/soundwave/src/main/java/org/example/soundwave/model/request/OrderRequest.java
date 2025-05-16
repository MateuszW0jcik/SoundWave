package org.example.soundwave.model.request;

import jakarta.validation.constraints.NotNull;

public record OrderRequest(
        @NotNull(message = "Address id can't be null")
        Long addressId,
        @NotNull(message = "Contact id can't be null")
        Long contactId,
        @NotNull(message = "Payment id can't be null")
        Long paymentId,
        @NotNull(message = "Shipping method id can't be null")
        Long shippingMethodId
) {
}
