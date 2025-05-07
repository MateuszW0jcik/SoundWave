package org.example.soundwave.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.PaymentDTO;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.request.PaymentRequest;
import org.example.soundwave.service.PaymentService;
import org.example.soundwave.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Payment")
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getUserPayments(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(paymentService.getUserPayments(user));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addPayment(@Valid @RequestBody PaymentRequest request,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        paymentService.addPayment(request, user);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editUserPayment(@PathVariable Long id,
                                             @Valid @RequestBody PaymentRequest request,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        paymentService.editUserPayment(id, request, user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUserPayment(@PathVariable Long id,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        paymentService.deleteUserPayment(id, user);
        return ResponseEntity.noContent().build();
    }
}
