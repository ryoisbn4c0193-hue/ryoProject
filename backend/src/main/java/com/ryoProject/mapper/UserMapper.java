package com.ryoProject.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.ryoProject.dto.User;

import java.util.List;

@Mapper
public interface UserMapper {

    User SelectById(@Param("id") Long id);

    List<User> selectUsersByName(@Param("name")String name);

    List<User> selectAll();
}