package org.example.soundwave.model.request;

import jakarta.validation.constraints.NotBlank;

public record MessageRequest(
        @NotBlank(message = "Content can't be empty")
        String content,
        String name,
        String email
){}
