package org.example.soundwave.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.ShoppingCartItemDTO;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.request.ShoppingCartItemRequest;
import org.example.soundwave.service.ShoppingCartItemService;
import org.example.soundwave.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Shopping cart")
@RestController
@RequestMapping("/api/shopping_cart")
@RequiredArgsConstructor
public class ShoppingCartItemController {
    private final ShoppingCartItemService shoppingCartItemService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<ShoppingCartItemDTO>> getUserShoppingCartItems(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(shoppingCartItemService.getUserShoppingCartItems(user));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addUserShoppingCartItem(@Valid @RequestBody ShoppingCartItemRequest request,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        shoppingCartItemService.addUserShoppingCartItem(request, user);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUserShoppingCartItem(@PathVariable Long id,
                                                        @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        shoppingCartItemService.deleteUserShoppingCartItem(id, user);
        return ResponseEntity.noContent().build();
    }
}
