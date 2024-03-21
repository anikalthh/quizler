package quizler.backendApp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    
    String userId;
    String username;
    String firstName;
    String lastName;
    String email;
    String password;

}
