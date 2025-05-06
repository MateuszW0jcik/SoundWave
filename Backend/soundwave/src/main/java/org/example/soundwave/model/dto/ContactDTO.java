package org.example.soundwave.model.dto;

import lombok.Data;
import org.example.soundwave.model.entity.Contact;

@Data
public class ContactDTO {
    private String email;
    private String phoneNumber;

    public ContactDTO(Contact contact){
        email = contact.getEmail();
        phoneNumber = contact.getPhoneNumber();
    }
}
