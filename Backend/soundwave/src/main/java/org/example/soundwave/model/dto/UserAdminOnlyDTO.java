package org.example.soundwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.soundwave.model.entity.User;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserAdminOnlyDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private boolean admin;
    private boolean active;
    private Instant createdAt;

    public UserAdminOnlyDTO(User user){
        id = user.getId();
        firstName = user.getFirstName();
        lastName = user.getLastName();
        email = user.getEmail();
        admin = user.getRoles().stream()
                .anyMatch(role -> "ADMIN".equals(role.getName()));
        active = user.isActive();
        createdAt = user.getCreatedAt();
    }
}
