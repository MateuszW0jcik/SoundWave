package org.example.soundwave.service;

import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.MessageDTO;
import org.example.soundwave.model.entity.Message;
import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.exception.MessageException;
import org.example.soundwave.model.exception.ProductException;
import org.example.soundwave.model.request.MessageRequest;
import org.example.soundwave.repository.MessageRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserService userService;

    public void createMessage(MessageRequest request, UserDetails userDetails) {
        if (userDetails != null && userService.existsByUsername(userDetails.getUsername())) {
            User user = userService.findUserByUsername(userDetails.getUsername());
            if (exitsMessageByUser(user)) {
                throw new MessageException("Your last message is still waiting for the administrator to review it.");
            }
            Message message = Message.builder()
                    .content(request.content())
                    .user(user)
                    .sentAt(Instant.now()).build();
            saveMessage(message);
        } else {
            if (exitsMessageByEmail(request.email())) {
                throw new MessageException("Your last message is still waiting for the administrator to review it.");
            }
            if (request.email().isEmpty() || request.name().isEmpty()){
                throw new MessageException("Invalid name or email.");
            }
            Message message = Message.builder()
                    .content(request.content())
                    .name(request.name())
                    .email(request.email())
                    .sentAt(Instant.now()).build();
            saveMessage(message);
        }
    }

    public void deleteMessage(Long id) {
        Message message = findMessageById(id);

        messageRepository.delete(message);
    }

    public void saveMessage(Message message) {
        messageRepository.save(message);
    }

    public boolean exitsMessageByUser(User user) {
        return messageRepository.existsMessageByUser(user);
    }

    public boolean exitsMessageByEmail(String email) {
        return messageRepository.existsMessageByEmail(email);
    }

    public Message findMessageById(Long id){
        return messageRepository.findById(id)
                .orElseThrow(() -> new MessageException("Message with id: " + id + " do not exist"));
    }
}
