package quizler.backendApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    
    private String userid;
    private String username;
    private String firstname;
    private String lastname;
    private String email;
    private String token;

}

