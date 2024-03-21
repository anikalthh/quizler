package quizler.backendApp.service;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.qos.logback.classic.pattern.Util;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import quizler.backendApp.repo.MongoRepository;
import quizler.backendApp.utility.Utils;

@Service
public class QuizService {

    @Autowired
    private MongoRepository mongoRepo;
    
    // QUIZ DATA 
    // Returns Quiz ID generated in Mongo DB
    public String saveQuiz(String userId, JsonObject quizinfo, JsonArray qnsJson) {
        Document quizDoc = Utils.quizToDocument(userId, quizinfo, qnsJson);
        return mongoRepo.saveQuiz(quizDoc);
    }

    // Get Quiz
    public JsonObject getQuiz(String quizId) {
        Document quizDoc = mongoRepo.getQuiz(quizId);
        return Utils.quizToJson(quizDoc);
    }

    // SCORES DATA -- Save quiz attempts
    public String saveQuizAttempt(JsonObject jsonQuizAttempt) {
        Document quizAttemptDoc = Utils.quizAttemptToDocument(jsonQuizAttempt);
        return mongoRepo.saveQuizAttempt(quizAttemptDoc);
    }

}
