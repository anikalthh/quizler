package quizler.backendApp.model;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
// @Builder(builderMethodName = "userBuilder")
@Entity
@Table(name = "users")
public class User {
    
    @Id
    private String userid;
    private String username;
    private String firstname;
    private String lastname;
    private String email;
    private String password;

    public User(String username, String firstname, String lastname, String email, String password) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.userid = UUID.randomUUID().toString().substring(0, 8);
    }

    public User() {
        this.userid = UUID.randomUUID().toString().substring(0, 8);
    }
}
