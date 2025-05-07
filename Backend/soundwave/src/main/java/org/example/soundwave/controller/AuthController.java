package org.example.soundwave.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.TokenPair;
import org.example.soundwave.model.entity.RefreshToken;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.exception.AuthException;
import org.example.soundwave.model.request.LoginRequest;
import org.example.soundwave.model.request.RefreshRequest;
import org.example.soundwave.model.request.RegisterRequest;
import org.example.soundwave.model.response.LoginResponse;
import org.example.soundwave.model.response.RefreshResponse;
import org.example.soundwave.repository.UserRepository;
import org.example.soundwave.security.JwtTokenProvider;
import org.example.soundwave.service.AuthService;
import org.example.soundwave.service.RefreshTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/token/refresh")
    public ResponseEntity<RefreshResponse> refreshToken(@Valid @RequestBody RefreshRequest request) {
        TokenPair tokens = refreshTokenService.refreshAuthTokens(request.refreshToken());
        return ResponseEntity.ok(
                new RefreshResponse(tokens.getAccessToken(), tokens.getRefreshToken())
        );
    }
}
