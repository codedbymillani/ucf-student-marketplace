package com.ucfmarketplace.api.repository;

import com.ucfmarketplace.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Spring automatically generates: SELECT * FROM users WHERE username = ?
    Optional<User> findByUsername(String username);
    
    // Spring automatically generates: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
}