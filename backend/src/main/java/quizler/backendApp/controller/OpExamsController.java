package quizler.backendApp.controller;

import java.io.StringReader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import quizler.backendApp.service.OpExamsAPI;
import quizler.backendApp.service.QuizService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class OpExamsController {

    @Autowired
    private OpExamsAPI api;

    @Autowired
    private QuizService quizSvc;

    // Post Mapping to get generated questions and save them
    @PostMapping("/generate")
    public ResponseEntity<String> generateQuestions(@RequestBody() String payload) {
        JsonObject quizinfo = Json.createReader(new StringReader(payload)).readObject();
        System.out.printf("\n\n>>>> JSON OBJECT PASSED OVER INTO SB: %s\n\n", quizinfo);

        JsonObject resp = api.generateQuestions(
                quizinfo.getString("extractedText"),
                quizinfo.getString("questionType"),
                quizinfo.getString("language"),
                quizinfo.getString("difficulty"));

        // Save generated quiz
        String quizId = quizSvc.saveQuiz(quizinfo.getString("userId"), quizinfo, resp.get("data").asJsonArray());

        // Create JSON Response Body for Angular (generated quiz from the API and the
        // QuizId generated in Mongo)
        JsonObject jsonResponse = Json.createObjectBuilder()
                .add("documentId", quizinfo.getString("documentId"))
                .add("quizId", quizId)
                .add("data", resp.get("data"))
                .build();

        System.out.printf("---- SENDING THIS TO ANGULAR AFTER SAVING INTO MONGO ----: %s\n\n", jsonResponse);
        return ResponseEntity.ok().body(jsonResponse.toString());
    }
}
