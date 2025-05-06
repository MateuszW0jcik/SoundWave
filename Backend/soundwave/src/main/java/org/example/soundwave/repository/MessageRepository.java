package org.example.soundwave.repository;

import org.example.soundwave.model.entity.Message;
import org.example.soundwave.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
    boolean existsMessageByEmail(String email);
    boolean existsMessageByUser(User user);
}
