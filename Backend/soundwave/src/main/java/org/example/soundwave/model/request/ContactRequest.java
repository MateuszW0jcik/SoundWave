package org.example.soundwave.model.request;

import jakarta.validation.constraints.Email;

public record ContactRequest(
        @Email(message = "Email should be valid")
        String email,
        String phoneNumber
) {
}
