package quizler.backendApp.repo;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import quizler.backendApp.model.User;

@Repository
public interface UsersRepository extends JpaRepository<User, String> {

    Optional<User> findByUsername(String username);
    
} 

