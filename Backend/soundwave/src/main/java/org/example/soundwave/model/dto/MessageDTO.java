package org.example.soundwave.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.Instant;

@Data
public class MessageDTO {
    @NotBlank(message = "Content can't be empty")
    private String content;

    private String name;

    @Email(message = "Email should be valid")
    private String email;

    private Instant sentAt;
}
