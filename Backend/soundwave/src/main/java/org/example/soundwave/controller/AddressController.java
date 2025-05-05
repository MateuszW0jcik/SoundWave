package org.example.soundwave.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.AddressDTO;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.service.AddressService;
import org.example.soundwave.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;
    private final UserService userService;

    @PostMapping("/add")
    public ResponseEntity<?> addAddress(@Valid @RequestBody AddressDTO request,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        addressService.addAddress(request, user);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUserAddress(@PathVariable Long id,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        addressService.deleteUserAddress(id, user);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editUserAddress(@PathVariable Long id,
                                         @Valid @RequestBody AddressDTO request,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        addressService.editUserAddress(id, request, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<AddressDTO>> getUserAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(addressService.getUserAddresses(user));
    }
}
