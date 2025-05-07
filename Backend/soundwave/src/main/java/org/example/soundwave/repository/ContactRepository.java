package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Contact;
import org.example.soundwave.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findContactsByUser(User user);
}
