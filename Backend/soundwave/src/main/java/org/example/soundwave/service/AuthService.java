package org.example.soundwave.service;

import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.exception.AuthException;
import org.example.soundwave.model.request.LoginRequest;
import org.example.soundwave.model.request.RegisterRequest;
import org.example.soundwave.model.entity.Role;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.repository.RoleRepository;
import org.example.soundwave.repository.UserRepository;
import org.example.soundwave.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email already in use");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getEmail().split("@")[0]);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new AuthException("Server problem"));
        user.setRoles(Collections.singleton(userRole));

        return userRepository.save(user);
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthException("Invalid password");
        }

        return tokenProvider.generateToken(user);
    }
}
