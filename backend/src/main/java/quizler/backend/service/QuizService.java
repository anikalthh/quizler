package quizler.backend.service;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import quizler.backend.model.Quiz;
import quizler.backend.repo.MongoRepository;

@Service
public class QuizService {

    @Autowired
    private MongoRepository mongoRepo;
    
    // QUIZ DATA
    public void saveQuiz(String userId, String documentId, JsonObject quizinfo, JsonArray qnsJson) {
        Document quizDoc = Quiz.fromJsonToDocument(userId, documentId, quizinfo, qnsJson);
        mongoRepo.saveQuiz(quizDoc);
    }

    // SCORES DATA

}
