package org.example.soundwave.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.soundwave.model.entity.User;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String firstName;
    private String lastName;
    private String email;

    public UserDTO(User user){
        firstName = user.getFirstName();
        lastName = user.getLastName();
        email = user.getEmail();
    }
}
