package com.ucfmarketplace.api.service;

import com.ucfmarketplace.api.model.User;
import com.ucfmarketplace.api.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // Dependency injection via constructor
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // Handles registering a brand new student account safely
    public User registerUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }

        // Securely hash the password before saving to MySQL
        String hashed = passwordEncoder.encode(user.getPasswordHash());
        user.setPasswordHash(hashed);

        return userRepository.save(user);
    }

    // Finds a user by their unique ID for listing linking
    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }
}