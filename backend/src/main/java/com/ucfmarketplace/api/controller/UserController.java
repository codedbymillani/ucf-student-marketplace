package com.ucfmarketplace.api.controller;

import com.ucfmarketplace.api.model.User;
import com.ucfmarketplace.api.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allows your frontend files to safely talk to this backend
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Listens for POST requests to http://localhost:8080/api/users/register
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            // Returns a clean error message if the username or email is already taken
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}