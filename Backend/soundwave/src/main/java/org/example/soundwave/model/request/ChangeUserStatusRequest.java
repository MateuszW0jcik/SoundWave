package org.example.soundwave.model.request;

import jakarta.validation.constraints.NotNull;

public record ChangeUserStatusRequest (
        @NotNull(message = "User id is required")
        Long userId,
        @NotNull(message = "Admin is required")
        boolean admin,
        @NotNull(message = "Active is required")
        boolean active
){}
