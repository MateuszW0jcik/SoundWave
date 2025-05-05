package org.example.soundwave.service;

import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.entity.RefreshToken;
import org.example.soundwave.model.exception.AuthException;
import org.example.soundwave.model.request.LoginRequest;
import org.example.soundwave.model.request.RegisterRequest;
import org.example.soundwave.model.entity.Role;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.response.LoginResponse;
import org.example.soundwave.repository.RoleRepository;
import org.example.soundwave.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;

    public void register(RegisterRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            throw new AuthException("Email already in use");
        }

        User user = User.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .active(true)
                .createdAt(Instant.now()).build();

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new AuthException("Server problem"));
        user.addRole(userRole);

        userService.saveUser(user);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userService.findUserByEmail(request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthException("Invalid password");
        }

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        String accessToken = tokenProvider.generateToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken()).build();
    }
}
