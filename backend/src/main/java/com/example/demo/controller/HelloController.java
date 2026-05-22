package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class HelloController {
    private final UserRepository userRepository;

    public HelloController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/api/hello")
    public Map<String, String> hello() {
        return Map.of("message", "Hello from Spring Boot");
    }

    @GetMapping("/api/users")
    public List<User> users() {
        return userRepository.findAll();
    }
}

