package org.example.soundwave.model.dto;

import lombok.*;
import org.example.soundwave.model.entity.Contact;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactDTO {
    private Long id;
    private String email;
    private String phoneNumber;

    public ContactDTO(Contact contact){
        id = contact.getId();
        email = contact.getEmail();
        phoneNumber = contact.getPhoneNumber();
    }
}
