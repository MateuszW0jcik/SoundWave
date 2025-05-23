package org.example.soundwave.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ChangeUserLoginEmailRequest(
        @NotBlank(message = "Email can't be empty")
        @Email(message = "Incorrect email format")
        String currentPassword,
        @NotBlank(message = "Email can't be empty")
        @Email(message = "Incorrect email format")
        String email
) {
}
