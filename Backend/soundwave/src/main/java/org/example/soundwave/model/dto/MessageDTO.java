package org.example.soundwave.model.dto;

import lombok.*;
import org.example.soundwave.model.entity.Message;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private Long id;
    private String content;
    private String name;
    private String email;
    private Instant sentAt;

    public MessageDTO(Message message){
        id = message.getId();
        content = message.getContent();
        name = message.getName();
        email = message.getEmail();
        sentAt = message.getSentAt();
    }
}
