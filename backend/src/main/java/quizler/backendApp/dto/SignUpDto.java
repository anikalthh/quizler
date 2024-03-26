package quizler.backendApp.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class SignUpDto {

    String userid;
    String username;
    String firstname;
    String lastname;
    String email;
    char[] password;

    public SignUpDto(String username, String firstname, String lastname, String email, char[] password) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.userid = UUID.randomUUID().toString().substring(0, 8);
    }

}
