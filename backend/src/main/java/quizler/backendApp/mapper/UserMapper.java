package quizler.backendApp.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import quizler.backendApp.dto.SignUpDto;
import quizler.backendApp.dto.UserDto;
import quizler.backendApp.model.User;

@Mapper(componentModel = "spring")
@Component
public interface UserMapper {

    UserDto toUserDto(User user);
    
    @Mapping(target = "password", ignore = true)
    User signUpToUser(SignUpDto signUpDto);

} 
