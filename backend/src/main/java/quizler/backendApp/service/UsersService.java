package quizler.backendApp.service;

import java.nio.CharBuffer;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import quizler.backendApp.dto.CredentialsDto;
import quizler.backendApp.dto.SignUpDto;
import quizler.backendApp.dto.UserDto;
import quizler.backendApp.exception.AppException;
import quizler.backendApp.mapper.UserMapper;
import quizler.backendApp.model.User;
import quizler.backendApp.repo.UsersRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsersService {
    
    @Autowired
    public UsersRepository userRepo;
    
    @Autowired
    public PasswordEncoder passwordEncoder;

    @Autowired
    public UserMapper userMapper;

    public UserDto login(CredentialsDto credentialsDto) {
        User user = userRepo.findByUsername(credentialsDto.username())
            .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()), user.getPassword())) {
            return userMapper.toUserDto(user);
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public UserDto register(SignUpDto userDto) {
        Optional<User> optionalUser = userRepo.findByUsername(userDto.getUsername());

        if (optionalUser.isPresent()) {
            throw new AppException("Login already exists", HttpStatus.BAD_REQUEST);
        }


        User user = userMapper.signUpToUser(userDto);
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDto.getPassword())));

        User savedUser = userRepo.save(user);

        return userMapper.toUserDto(savedUser);
    }

    public UserDto findByUsername(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        return userMapper.toUserDto(user);
    }

}
