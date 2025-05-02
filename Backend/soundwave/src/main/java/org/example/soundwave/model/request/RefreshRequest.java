package org.example.soundwave.model.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class RefreshRequest {
    @NotBlank(message = "RefreshToken can't be empty")
    String refreshToken;
}
