package org.example.soundwave.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

public record ContactRequest(
        @Email(message = "Email should be valid")
        String email,
        @Pattern(
                regexp = "\\+?[0-9]{7,15}",
                message = "Phone number should be valid and contain 7 to 15 digits, optionally starting with '+'"
        )
        String phoneNumber
) {
}
