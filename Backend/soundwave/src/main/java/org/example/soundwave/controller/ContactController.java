package org.example.soundwave.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.ContactDTO;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.request.ContactRequest;
import org.example.soundwave.service.ContactService;
import org.example.soundwave.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Contact")
@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {
    private final ContactService contactService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<ContactDTO>> getUserContacts(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(contactService.getUserContacts(user));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addContact(@Valid @RequestBody ContactRequest request,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        contactService.addContact(request, user);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editUserContact(@PathVariable Long id,
                                             @Valid @RequestBody ContactRequest request,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        contactService.editUserContact(id, request, user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUserContact(@PathVariable Long id,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        contactService.deleteUserContact(id, user);
        return ResponseEntity.noContent().build();
    }
}
