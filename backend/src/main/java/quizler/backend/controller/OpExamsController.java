package quizler.backend.controller;

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
import quizler.backend.service.OpExamsAPI;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class OpExamsController {

    @Autowired
    private OpExamsAPI api;
    
    // Post Mapping to get generated questions and save them
    @PostMapping("/generate")
    public ResponseEntity<String> generateQuestions(@RequestBody() String payload) {
        JsonObject quizinfo = Json.createReader(new StringReader(payload)).readObject();
        System.out.printf("\n\n>>>> JSON OBJECT PASSED OVER INTO SB: %s\n\n", quizinfo);

        JsonObject resp = api.generateQuestions(
            quizinfo.getString("extractedText"),
            quizinfo.getString("questionType"),
            quizinfo.getString("language"),
            quizinfo.getString("difficulty"),
            "testing123"
        );

        return ResponseEntity.ok().body(resp.toString());
    }
}
