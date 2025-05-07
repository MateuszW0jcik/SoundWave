package org.example.soundwave.service;

import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.UserDTO;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.exception.AuthException;
import org.example.soundwave.model.exception.UserException;
import org.example.soundwave.model.request.ChangeUserLoginEmailRequest;
import org.example.soundwave.model.request.ChangeUserPasswordRequest;
import org.example.soundwave.model.request.EditUserFullNameRequest;
import org.example.soundwave.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserException("User not found"));
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserException("User not found"));
    }

    public UserDTO editUserFullName(EditUserFullNameRequest request, User user) {
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());

        saveUser(user);

        return new UserDTO(user);
    }

    public void changeUserPassword(ChangeUserPasswordRequest request, User user) {
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new UserException("Invalid old password");
        }

        if(!request.newPassword().equals(request.repeatedPassword())){
            throw new UserException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        saveUser(user);
    }

    public void changeUserLoginEmail(ChangeUserLoginEmailRequest request, User user) {
        user.setEmail(request.email());
        user.setUsername(request.email());
        saveUser(user);
    }
}
