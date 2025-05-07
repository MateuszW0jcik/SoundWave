package org.example.soundwave.model.request;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
        @NotBlank(message = "RefreshToken can't be empty")
        String refreshToken
) {
}