package quizler.backendApp.controller;

import java.io.StringReader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import quizler.backendApp.service.QuizService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired
    private QuizService quizSvc;

    // Post Mapping New Quiz Data
    @PostMapping("/submitquiz")
    public ResponseEntity<String> processQuizSubmission(@RequestBody String payload) {

        JsonObject quizJson = Json.createReader(new StringReader(payload)).readObject();

        System.out.printf("ANSWERS JSON from processQuizSubmission() Post Mapping: %s\n\n", quizJson);

        String quizAttemptId = quizSvc.saveQuizAttempt(quizJson);

        JsonObject resp = Json.createObjectBuilder()
                .add("quizAttemptId", quizAttemptId)
                .build();

        return ResponseEntity.ok().body(resp.toString());
    }

    // Get Mapping to retrieve generated quiz
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<String> getQuiz(@PathVariable("quizId") String quizId) {
        return ResponseEntity.ok().body(quizSvc.getQuiz(quizId).toString());
    }
}
