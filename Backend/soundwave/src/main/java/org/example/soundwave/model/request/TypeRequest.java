package org.example.soundwave.model.request;

import jakarta.validation.constraints.NotBlank;

public record TypeRequest (
        @NotBlank(message = "Name can't be empty")
        String name
){}
