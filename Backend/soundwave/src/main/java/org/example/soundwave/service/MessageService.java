package org.example.soundwave.service;

import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.BrandDTO;
import org.example.soundwave.model.dto.MessageDTO;
import org.example.soundwave.model.entity.Brand;
import org.example.soundwave.model.entity.Message;
import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.exception.MessageException;
import org.example.soundwave.model.exception.ProductException;
import org.example.soundwave.model.request.MessageRequest;
import org.example.soundwave.model.response.PageResponse;
import org.example.soundwave.repository.MessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserService userService;

    public void createMessage(MessageRequest request, UserDetails userDetails) {
        if (userDetails != null && userService.existsByUsername(userDetails.getUsername())) {
            User user = userService.findUserByUsername(userDetails.getUsername());
            if (exitsMessageByEmail(user.getEmail())) {
                throw new MessageException("Your last message is still waiting for the administrator to review it.");
            }
            Message message = Message.builder()
                    .content(request.content())
                    .email(user.getEmail())
                    .name(user.getFirstName() + " " + user.getLastName())
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

    public boolean exitsMessageByEmail(String email) {
        return messageRepository.existsMessageByEmail(email);
    }

    public Message findMessageById(Long id){
        return messageRepository.findById(id)
                .orElseThrow(() -> new MessageException("Message with id: " + id + " do not exist"));
    }

    public PageResponse<MessageDTO> getMessages(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Message> messages = messageRepository.findAll(pageable);

        List<MessageDTO> content = messages.getContent()
                .stream()
                .map(MessageDTO::new)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                messages.getNumber(),
                messages.getSize(),
                messages.getTotalElements(),
                messages.getTotalPages(),
                messages.isLast());
    }
}
