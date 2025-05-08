package org.example.soundwave.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.soundwave.model.dto.ProductDTO;
import org.example.soundwave.model.dto.UserAdminOnlyDTO;
import org.example.soundwave.model.dto.UserDTO;
import org.example.soundwave.model.entity.Product;
import org.example.soundwave.model.entity.Role;
import org.example.soundwave.model.entity.User;
import org.example.soundwave.model.exception.AuthException;
import org.example.soundwave.model.exception.UserException;
import org.example.soundwave.model.request.ChangeUserLoginEmailRequest;
import org.example.soundwave.model.request.ChangeUserPasswordRequest;
import org.example.soundwave.model.request.ChangeUserStatusRequest;
import org.example.soundwave.model.request.EditUserFullNameRequest;
import org.example.soundwave.model.response.PageResponse;
import org.example.soundwave.repository.RoleRepository;
import org.example.soundwave.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
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

    public User findUserById(Long id) {
        return userRepository.findById(id)
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

        if (!request.newPassword().equals(request.repeatedPassword())) {
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

    public PageResponse<UserAdminOnlyDTO> getUsers(int pageNo, int pageSize, String sortBy, String sortDir, String name) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<User> users;

        users = userRepository.findByName(name.trim(), pageable);

        List<UserAdminOnlyDTO> content = users.getContent()
                .stream()
                .map(UserAdminOnlyDTO::new)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                users.getNumber(),
                users.getSize(),
                users.getTotalElements(),
                users.getTotalPages(),
                users.isLast());
    }

    @Transactional
    public void changeUserStatus(ChangeUserStatusRequest request) {
        User user = findUserById(request.userId());
        user.setActive(request.active());
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new AuthException("Server problem"));
        if (request.admin() && user.getRoles().stream().noneMatch(role -> "ADMIN".equals(role.getName()))) {
            user.addRole(adminRole);
        } else if (!request.admin() && user.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName()))) {
            user.removeRole(adminRole);
        }
        saveUser(user);
    }
}
