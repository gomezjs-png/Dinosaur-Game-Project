package com.example.demo;

import org.springframework.dao.DataIntegrityViolationException;                 // try/catch when people save with same name
import org.springframework.http.HttpStatus;                                     // Status codes
import org.springframework.http.ResponseEntity;                                 // The return type of signup, login and error
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;        // Hashing passwords and checking them
import org.springframework.web.bind.annotation.PostMapping;                     // Postmapping the signup and login
import org.springframework.web.bind.annotation.RequestBody;                     // Turns the page’s JSON into SignupRequest / LoginRequest
import org.springframework.web.bind.annotation.RequestMapping;                  // Setting the base path with "/api" for each endpoint in file
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;// handles web requests and returning JSON


import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")

@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
public class AuthController{

    private final UserRepo users;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserRepo users){
        this.users = users;
    }

    //JSON the page is sending
    record signupRequest(String username, String email, String password){}
    record LoginRequest(String identifier, String password){}

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody signupRequest req){
        String username = req.username() == null ? null : req.username().trim();
        String email = req.email() == null ? null : req.email().trim().toLowerCase();

        if (username == null || !username.matches("[A-Za-z0-9_]{3,30}")){
            return ResponseEntity.badRequest().body(Map.of("error", "Username must be 3-30 letters, numbers, and underscores."));
        }
        else if (email == null || !req.email().contains("@")){
            return ResponseEntity.badRequest().body(Map.of("error", "Enter a valid email."));
        }
        else if (req.password() == null || req.password().length()<8){
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 8 characters."));
        }
        else if (users.existsByUsernameIgnoreCase(username)) {
            return ResponseEntity.badRequest().body(Map.of("error", "That username is already taken."));
        }
        else if (users.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "An account with that email already exists."));
        }

        try {
            users.save(new User(username, email, encoder.encode(req.password())));
        } catch (DataIntegrityViolationException e) {
            // Someone grabbed the same username/email at the same moment (UNIQUE constraint)
            return error(HttpStatus.CONFLICT, "That username or email is already taken.");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Account created! You can sign in now.", "username", username));
    }

    //Will run once recieves a username or email plus a password
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest req) {
        //if any response is blank will reject the request
        if (req.identifier() == null || req.identifier().isBlank() || req.password() == null) {
            return error(HttpStatus.BAD_REQUEST, "Enter your username or email and your password.");
        }
        //If input contains an @, will look up a user by email
        String id = req.identifier().trim();
        Optional<User> user = id.contains("@")
                ? users.findByEmailIgnoreCase(id)
                : users.findByUsernameIgnoreCase(id);

        //Using BCrypt to compare the typed password and the password in the database
        // Same message for "no such user" and "wrong password" so nobody can probe which accounts exist
        if (user.isEmpty() || !encoder.matches(req.password(), user.get().getPasswordHash())) {
            return error(HttpStatus.UNAUTHORIZED, "Invalid username/email or password.");
        }

        return ResponseEntity.ok(Map.of(
                "message", "Welcome back, " + user.get().getUsername() + "!",
                "username", user.get().getUsername()));
    }
    private static ResponseEntity<Map<String, String>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("error", message));
    }
}
