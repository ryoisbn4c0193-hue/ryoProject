package com.ryoProject.service;

import com.ryoProject.dto.User;

import java.util.List;

public interface UserService  {
    List<User> findByNameContainingIgnoreCase(String name);

    List<User> findAllUsers();
}
