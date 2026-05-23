package com.ryoProject.service;

import com.ryoProject.dto.User;
import com.ryoProject.mapper.UserMapper;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper mapper;

    public UserServiceImpl(UserMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public List<User> findByNameContainingIgnoreCase(String name) {
        return mapper.selectUsersByName(name);
    }

    @Override
    public List<User> findAllUsers() {
        return mapper.selectAll();
    }
}