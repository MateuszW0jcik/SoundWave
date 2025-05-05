package org.example.soundwave.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email can't be empty")
    @Email(message = "Incorrect email format")
    private String email;

    @NotBlank(message = "Password can't be empty")
    private String password;
}
