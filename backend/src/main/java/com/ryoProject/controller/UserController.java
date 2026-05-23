package com.ryoProject.controller;

import com.ryoProject.dto.User;
import com.ryoProject.service.UserService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class UserController {
    private final UserService service;


    public UserController(UserService service) {
    this.service = service;
    }

    @GetMapping("/api/hello")
    public Map<String, String> hello() {
        return Map.of("message", "Hello from Spring Boot RyoProject");
    }

    @GetMapping("/api/users")
    public List<User> users(@RequestParam(required = false) String name) {
        if (name != null && !name.trim().isEmpty()) {
            return service.findByNameContainingIgnoreCase(name);
        }
        return service.findAllUsers();
    }
}

