package org.example.soundwave.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.ContactDTO;
import org.example.soundwave.model.entity.Contact;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.exception.AddressException;
import org.example.soundwave.model.exception.ContactException;
import org.example.soundwave.model.request.ContactRequest;
import org.example.soundwave.repository.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactRepository contactRepository;

    public void addContact(ContactRequest request, User user) {
        Contact contact = Contact.builder()
                .email(request.email())
                .phoneNumber(request.phoneNumber())
                .user(user).build();

        saveContact(contact);
    }

    public void saveContact(Contact contact) {
        contactRepository.save(contact);
    }

    public Contact findContactById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new ContactException("Contact with id: " + id + " do not exist"));
    }

    public void deleteUserContact(Long id, User user) {
        Contact contact = findContactById(id);

        if (!contact.getUser().equals(user)) {
            throw new ContactException("User do not contains this contact");
        }

        deleteContact(contact);
    }

    public void deleteContact(Contact contact) {
        contactRepository.delete(contact);
    }

    public void editUserContact(Long id, ContactRequest request, User user) {
        Contact contact = findContactById(id);

        if (!contact.getUser().equals(user)) {
            throw new ContactException("User do not contains this contact");
        }

        contact.setEmail(request.email());
        contact.setPhoneNumber(request.phoneNumber());

        saveContact(contact);
    }

    public List<ContactDTO> getUserContacts(User user) {
        return contactRepository.findContactsByUser(user)
                .stream()
                .map(ContactDTO::new)
                .collect(Collectors.toList());
    }
}
