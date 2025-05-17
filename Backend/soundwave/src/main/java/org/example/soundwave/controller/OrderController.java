package org.example.soundwave.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.AddressDTO;
import org.example.soundwave.model.dto.OrderDTO;
import org.example.soundwave.model.dto.OrderDetailsDTO;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.request.AddressRequest;
import org.example.soundwave.model.request.OrderRequest;
import org.example.soundwave.model.response.PageResponse;
import org.example.soundwave.service.OrderService;
import org.example.soundwave.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Order")
@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<PageResponse<OrderDTO>> getUserOrders(
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "10", required = false) int size,
            @RequestParam(value = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(orderService.getUserOrders(user, page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<OrderDetailsDTO> getUserOrderDetails(@PathVariable Long id,
                                                                     @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(orderService.getUserOrderDetails(id, user));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest request,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        orderService.createOrder(request, user);
        return ResponseEntity.noContent().build();
    }
}
