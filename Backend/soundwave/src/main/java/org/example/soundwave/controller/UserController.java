package org.example.soundwave.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.ProductDTO;
import org.example.soundwave.model.dto.TokenPair;
import org.example.soundwave.model.dto.UserAdminOnlyDTO;
import org.example.soundwave.model.dto.UserDTO;
import org.example.soundwave.model.entity.Role;
import org.example.soundwave.model.entity.Type;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.request.ChangeUserLoginEmailRequest;
import org.example.soundwave.model.request.ChangeUserPasswordRequest;
import org.example.soundwave.model.request.ChangeUserStatusRequest;
import org.example.soundwave.model.request.EditUserFullNameRequest;
import org.example.soundwave.model.response.MeResponse;
import org.example.soundwave.model.response.PageResponse;
import org.example.soundwave.model.response.RefreshResponse;
import org.example.soundwave.service.RefreshTokenService;
import org.example.soundwave.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@Tag(name = "User")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<UserAdminOnlyDTO>> getUsers(
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "10", required = false) int size,
            @RequestParam(value = "sortBy", defaultValue = "name", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir,
            @RequestParam(value = "name", defaultValue = "", required = false) String name) {
        return ResponseEntity.ok(userService.getUsers(page, size, sortBy, sortDir, name));
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> getMe(@AuthenticationPrincipal UserDetails userDetails){
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(new MeResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRoles().stream().map(Role::getName).collect(Collectors.toList())));
    }

    @PutMapping("/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> changeUserStatus(@Valid @RequestBody ChangeUserStatusRequest request) {
        userService.changeUserStatus(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/name")
    public ResponseEntity<UserDTO> editUserFullName(@Valid @RequestBody EditUserFullNameRequest request,
                                                    @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(userService.editUserFullName(request, user));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changeUserPassword(@Valid @RequestBody ChangeUserPasswordRequest request,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        userService.changeUserPassword(request, user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/login_email")
    public ResponseEntity<RefreshResponse> changeUserLoginEmail(@Valid @RequestBody ChangeUserLoginEmailRequest request,
                                                                @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        userService.changeUserLoginEmail(request, user);
        TokenPair tokens = refreshTokenService.createNewTokensForUser(user);
        return ResponseEntity.ok(
                new RefreshResponse(tokens.getAccessToken(), tokens.getRefreshToken())
        );
    }
}
