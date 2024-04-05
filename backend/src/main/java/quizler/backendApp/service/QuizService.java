package quizler.backendApp.service;

import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
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

    // Delete Quiz
    public long deleteQuiz(String quizId) {
        return mongoRepo.deleteQuiz(quizId);
    }

    // Get all quizzes under a document
    public JsonArray getAllQuizzes(String docId) {
        List<Document> allDocumentsBSON = mongoRepo.getAllQuizzes(docId);

        JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();
        for (Document doc : allDocumentsBSON) {
            JsonObject documentJson = Utils.quizToJson(doc);
            jsonArrayBuilder.add(documentJson);
        }
        JsonArray jsonArray = jsonArrayBuilder.build();

        return jsonArray;
    }

    // SCORES DATA -- Save quiz attempts
    public String saveQuizAttempt(JsonObject jsonQuizAttempt) {
        Document quizAttemptDoc = Utils.quizAttemptToDocument(jsonQuizAttempt);
        return mongoRepo.saveQuizAttempt(quizAttemptDoc);
    }

    // Retrieves quiz attempts
    public JsonArray getAllAttempts(String quizId) {
        List<Document> allDocumentsBSON = mongoRepo.getAllAttempts(quizId);

        JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();
        for (Document doc : allDocumentsBSON) {
            JsonObject documentJson = Utils.quizAttemptToJson(doc);
            jsonArrayBuilder.add(documentJson);
        }
        JsonArray jsonArray = jsonArrayBuilder.build();

        return jsonArray;
    }

}
