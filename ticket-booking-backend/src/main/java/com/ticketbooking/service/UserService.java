package com.ticketbooking.service;

import com.ticketbooking.entity.User;
import com.ticketbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // In-memory session map: userId -> User (Java Collections usage)
    private final Map<Long, User> sessionMap = new HashMap<>();

    public Map<String, Object> register(User user) {
        Map<String, Object> response = new HashMap<>();
        if (userRepository.existsByEmail(user.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already registered");
            return response;
        }
        User saved = userRepository.save(user);
        response.put("success", true);
        response.put("message", "Registration successful");
        response.put("user", saved);
        return response;
    }

    public Map<String, Object> login(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        User user = userOpt.get();
        sessionMap.put(user.getId(), user);
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("user", user);
        return response;
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
