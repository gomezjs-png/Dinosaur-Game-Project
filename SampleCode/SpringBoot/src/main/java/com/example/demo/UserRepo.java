package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Talks to the `users` table. Spring writes the SQL for each method from its name,
 * e.g. findByEmailIgnoreCase -> SELECT * FROM users WHERE LOWER(email) = LOWER(?)
 */
public interface UserRepo extends JpaRepository<User, Integer> {
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByUsernameIgnoreCase(String username);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByUsernameIgnoreCase(String username);
}