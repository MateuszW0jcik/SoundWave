package org.example.soundwave.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.AddressDTO;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.request.AddressRequest;
import org.example.soundwave.service.AddressService;
import org.example.soundwave.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Address")
@RestController
@RequestMapping("/api/address")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<AddressDTO>> getUserAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(addressService.getUserAddresses(user));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addAddress(@Valid @RequestBody AddressRequest request,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        addressService.addAddress(request, user);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editUserAddress(@PathVariable Long id,
                                             @Valid @RequestBody AddressRequest request,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        addressService.editUserAddress(id, request, user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUserAddress(@PathVariable Long id,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        addressService.deleteUserAddress(id, user);
        return ResponseEntity.noContent().build();
    }
}
