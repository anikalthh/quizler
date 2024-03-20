package quizler.backend.controller;

import java.io.StringReader;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObject;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QuizController {
    
    // Post Mapping New Quiz Data
    @PostMapping("/quiz/new")
    public ResponseEntity<String> processNewQuiz(@RequestBody String payload) {

        JsonObject quizJson = Json.createReader(new StringReader(payload)).readObject();

        System.out.printf("QUIZ JSON from processNewQuiz() Post Mapping: %s\n\n", quizJson);
        JsonObject resp = Json.createObjectBuilder()
            .add("message", "quiz created")
            .build();

        return ResponseEntity.ok().body(resp.toString());
    }
}
