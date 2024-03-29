package quizler.backendApp.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;

import ch.qos.logback.core.subst.Token;

import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import quizler.backendApp.dto.CredentialsDto;
import quizler.backendApp.dto.SignUpDto;
import quizler.backendApp.dto.UserDto;
import quizler.backendApp.service.UsersService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class UserAuthenticationProvider {
    @Value("${security.jwt.token.secret-key}")
    private String secretKey;

    @Autowired
    private UsersService userService;

    @PostConstruct
    protected void init() {
        // this is to avoid having the raw secret key available in the JVM
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createToken(UserDto user) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + TimeUnit.DAYS.toMillis(1)); // 1 day

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withSubject(user.getUsername())
                .withIssuedAt(now)
                .withExpiresAt(validity)
                // .withClaim("username", user.getUsername())
                .withClaim("userid", user.getUserid())
                .withClaim("firstname", user.getFirstname())
                .withClaim("lastname", user.getLastname())
                .withClaim("email", user.getEmail())
                .sign(algorithm);
    }

    public Authentication validateToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        DecodedJWT decoded = verifier.verify(token);

        UserDto user = UserDto.builder()
                .username(decoded.getSubject())
                // .username(decoded.getClaim("username").asString())
                .userid(decoded.getClaim("userid").asString())
                .firstname(decoded.getClaim("firstname").asString())
                .lastname(decoded.getClaim("lastname").asString())
                .email(decoded.getClaim("email").asString())
                .build();

        return new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
    }

    public Authentication validateTokenStrongly(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        try {
            DecodedJWT decoded = verifier.verify(token);
            UserDto user = userService.findByUsername(decoded.getSubject());
            return new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
        } catch (TokenExpiredException e) {
            return null;
        }

    }
}
