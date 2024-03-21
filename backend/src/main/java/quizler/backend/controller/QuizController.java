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
import jakarta.json.JsonArray;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QuizController {
    
    // Post Mapping New Quiz Data
    @PostMapping("/submitquiz")
    public ResponseEntity<String> processQuizSubmission(@RequestBody String payload) {

        JsonArray quizJson = Json.createReader(new StringReader(payload)).readArray();

        System.out.printf("ANSWERS JSON from processQuizSubmission() Post Mapping: %s\n\n", quizJson);

        JsonObject resp = Json.createObjectBuilder()
            .add("message", "quiz created")
            .build();

        return ResponseEntity.ok().body(resp.toString());
    }
}
