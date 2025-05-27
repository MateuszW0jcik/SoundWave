package org.example.soundwave.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.GoogleUserInfo;
import org.example.soundwave.model.entity.RefreshToken;
import org.example.soundwave.model.exception.AuthException;
import org.example.soundwave.model.request.LoginRequest;
import org.example.soundwave.model.request.RegisterRequest;
import org.example.soundwave.model.entity.Role;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.response.LoginResponse;
import org.example.soundwave.repository.RoleRepository;
import org.example.soundwave.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Value("${google.client-id}")
    private String googleClientId;

    public void register(RegisterRequest request) {
        if (userService.existsByEmail(request.email())) {
            throw new AuthException("Email already in use");
        }

        User user = User.builder()
                .username(request.email())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .active(true)
                .createdAt(Instant.now()).build();

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new AuthException("Server problem"));
        user.addRole(userRole);

        userService.saveUser(user);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userService.findUserByEmail(request.email());

        if (!user.isActive()) {
            throw new AuthException("Your account is deactivated");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new AuthException("Invalid password");
        }

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        String accessToken = tokenProvider.generateToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken()).build();
    }

    public LoginResponse loginViaGoogle(String idToken) {
        GoogleUserInfo userInfo;
        try {
            String googleApiUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
            RestTemplate restTemplate = new RestTemplate();
            userInfo = restTemplate.getForObject(googleApiUrl, GoogleUserInfo.class);
        } catch (Exception ex) {
            throw new AuthException("Failed to login");
        }

        if (userInfo == null || !userInfo.getAudience().equals(googleClientId)) {
            throw new AuthException("Invalid Google ID token");
        }

        if (!userService.existsByEmail(userInfo.getEmail())) {
            register(new RegisterRequest(
                    userInfo.getGivenName(),
                    userInfo.getFamilyName(),
                    userInfo.getEmail(),
                    UUID.randomUUID().toString()
            ));
        }

        User user = userService.findUserByEmail(userInfo.getEmail());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        String accessToken = tokenProvider.generateToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken()).build();
    }

}
