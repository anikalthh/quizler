package quizler.backendApp.controller;

import java.io.StringReader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import quizler.backendApp.exception.QuizDeletionException;
import quizler.backendApp.service.QuizService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired
    private QuizService quizSvc;

    // Get Mapping to retrieve generated quiz
    @GetMapping("/quiz/{quizId}/{typeBased}")
    public ResponseEntity<String> getQuiz(@PathVariable("quizId") String quizId, @PathVariable("typeBased") String typeBased) {
        return ResponseEntity.ok().body(quizSvc.getQuiz(quizId, typeBased).toString());
    }

    @DeleteMapping("/quiz/{quizId}")
    public ResponseEntity<String> deleteQuiz(@PathVariable("quizId") String quizId) throws QuizDeletionException {

        Boolean deleteSuccess = quizSvc.deleteQuiz(quizId);

        JsonObjectBuilder builder = Json.createObjectBuilder();
        JsonObject resp;
        if (!deleteSuccess) {
            resp = builder.add("quizId", "error")
                    .build();
        } else {
            resp = builder.add("quizId", quizId)
                    .build();
        }

        // JsonObject resp = Json.createObjectBuilder()
        // .add("quizAttemptId", "test")
        // .build();

        return ResponseEntity.ok().body(resp.toString());
    }

    // Get Mapping to get all quizzes generated under a particular document uploaded
    @GetMapping("/{documentId}/quizzes")
    public ResponseEntity<String> getAllQuizzesContextBased(@PathVariable("documentId") String docId) {
        return ResponseEntity.ok().body(quizSvc.getAllQuizzes(docId).toString());
    }

    // Get Mapping to get all topic-generated quizzes 
    @GetMapping("/topic/quizzes/{userId}")
    public ResponseEntity<String> getAllTopicGeneratedQuizzes(@PathVariable("userId") String userId) {
        return ResponseEntity.ok().body(quizSvc.getAllTopicGeneratedQuizzes(userId).toString());
    }

    // QUIZ ATTEMPTS
    // Post Mapping New Quiz Data
    @PostMapping("/submitquiz/{typeBased}")
    public ResponseEntity<String> processQuizSubmission(@RequestBody String payload, @PathVariable("typeBased") String typeBased) {

        JsonObject quizJson = Json.createReader(new StringReader(payload)).readObject();

        String quizAttemptId = quizSvc.saveQuizAttempt(quizJson, typeBased);

        JsonObject resp = Json.createObjectBuilder()
                .add("quizAttemptId", quizAttemptId)
                .build();

        return ResponseEntity.ok().body(resp.toString());
    }

    @GetMapping("/{typeBased}/{quizId}/attempts")
    public ResponseEntity<String> getAllQuizAttempts(@PathVariable("quizId") String quizId, @PathVariable("typeBased") String typeBased) {
        // JsonArray quizAttemptsJsonArray = quizSvc.getAllAttempts(quizId);
        return ResponseEntity.ok().body(quizSvc.getAllAttempts(quizId, typeBased).toString());
    }
}
