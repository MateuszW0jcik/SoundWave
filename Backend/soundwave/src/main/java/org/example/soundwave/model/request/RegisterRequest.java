package org.example.soundwave.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "First name can't be empty")
    private String firstName;

    @NotBlank(message = "Last name can't be empty")
    private String lastName;

    @NotBlank(message = "Email can't be empty")
    @Email(message = "Incorrect email format")
    private String email;

    @NotBlank(message = "Password can't be empty")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;
}
