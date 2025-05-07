package org.example.soundwave.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.TokenPair;
import org.example.soundwave.model.dto.UserDTO;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.request.ChangeUserLoginEmailRequest;
import org.example.soundwave.model.request.ChangeUserPasswordRequest;
import org.example.soundwave.model.request.EditUserFullNameRequest;
import org.example.soundwave.model.response.RefreshResponse;
import org.example.soundwave.service.RefreshTokenService;
import org.example.soundwave.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Tag(name = "User")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

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
