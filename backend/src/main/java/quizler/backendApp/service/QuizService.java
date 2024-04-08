package quizler.backendApp.service;

import java.io.StringReader;
import java.util.List;

import javax.print.Doc;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import quizler.backendApp.exception.QuizDeletionException;
import quizler.backendApp.repo.MongoRepository;
import quizler.backendApp.utility.Utils;

@Service
public class QuizService {

    @Autowired
    private MongoRepository mongoRepo;

    // QUIZ DATA
    // Returns Quiz ID generated in Mongo DB (Content-based)
    public String saveQuiz(String userId, JsonObject quizinfo, JsonArray qnsJson) {
        Document quizDoc = Utils.quizToDocument(userId, quizinfo, qnsJson);
        return mongoRepo.saveQuiz(quizDoc);
    }

    // Returns Quiz ID generated in Mongo DB (Topic-based)
    // public String saveTopicBasedQuiz(String userId, JsonObject quizinfo, JsonArray qnsJson) {
    //     Document quizDoc = Utils.topicBasedQuizToDocument(userId, quizinfo, qnsJson);
    //     return mongoRepo.saveTopicBasedQuiz(quizDoc);
    // }

    // Get Quiz
    public String getQuiz(String quizId, String typeBase) {
        Document quizDoc = mongoRepo.getQuiz(quizId, typeBase);
        // if (typeBase == "contextBased") {
        //     return Utils.quizToJson(quizDoc);
        // } else {
        //     return Utils.topicBasedQuizToJson(quizDoc);
        // }
        return Utils.quizToJson(quizDoc);
    }

    // Delete Quiz
    @Transactional(rollbackFor = QuizDeletionException.class)
    public Boolean deleteQuiz(String quizId) throws QuizDeletionException {
        // delete quiz
        Boolean isQuizDeleted = mongoRepo.deleteQuiz(quizId);
        Boolean areAttemptsAllDeleted = mongoRepo.deleteQuizAttempts(quizId, "quiz");

        // rollback
        if (!isQuizDeleted || !areAttemptsAllDeleted) {
            throw new QuizDeletionException();
        } else {
            return true;
        }
    }

    // Get all quizzes under a document
    public JsonArray getAllQuizzes(String docId) {
        List<Document> allDocumentsBSON = mongoRepo.getAllQuizzes(docId);

        JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();
        for (Document doc : allDocumentsBSON) {
            JsonObject documentJson = Json.createReader(new StringReader(Utils.quizToJson(doc))).readObject();
            jsonArrayBuilder.add(documentJson);
        }
        JsonArray jsonArray = jsonArrayBuilder.build();

        return jsonArray;
    }

    // Get all topic-generated quizzes
    public JsonArray getAllTopicGeneratedQuizzes(String userId) {
        List<Document> allDocumentsBSON = mongoRepo.getAllTopicGeneratedQuizzes(userId);

        JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();
        for (Document doc : allDocumentsBSON) {
            JsonObject documentJson = Json.createReader(new StringReader(doc.toJson())).readObject();
            jsonArrayBuilder.add(documentJson);
        }
        JsonArray jsonArray = jsonArrayBuilder.build();

        return jsonArray;
    }

    // SCORES DATA -- Save quiz attempts
    public String saveQuizAttempt(JsonObject jsonQuizAttempt, String typeBased) {

        // if (typeBased == "contextBased") {
        //     Document quizAttemptDoc = Utils.quizAttemptToDocument(jsonQuizAttempt);
        //     return mongoRepo.saveQuizAttempt(quizAttemptDoc);
        // } else {
        //     Document quizAttemptDoc = Utils.topicBasedQuizAttemptToDocument(jsonQuizAttempt);
        //     return mongoRepo.saveTopicBasedQuizAttempt(quizAttemptDoc);
        // }

        Document quizAttemptDoc = Utils.quizAttemptToDocument(jsonQuizAttempt);
        return mongoRepo.saveQuizAttempt(quizAttemptDoc);

    }

    // Retrieves quiz attempts
    public JsonArray getAllAttempts(String quizId, String typeBased) {

        List<Document> allDocumentsBSON = mongoRepo.getAllAttempts(quizId);

        JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();

        // if (typeBased == "contextBased") {
        //     for (Document doc : allDocumentsBSON) {
        //         JsonObject documentJson = Utils.quizAttemptToJson(doc);
        //         jsonArrayBuilder.add(documentJson);
        //     }
        // } else {
        //     for (Document doc : allDocumentsBSON) {
        //         JsonObject documentJson = Json.createReader(new StringReader(doc.toJson())).readObject();
        //         jsonArrayBuilder.add(documentJson);
        //     }
        // }

        for (Document doc : allDocumentsBSON) {
            JsonObject documentJson = Json.createReader(new StringReader(doc.toJson())).readObject();
            jsonArrayBuilder.add(documentJson);
        }
        
        JsonArray jsonArray = jsonArrayBuilder.build();

        return jsonArray;
    }

    // Retrieve specific quiz attempt 
    public JsonObject getQuizAttempt(String attemptId) {
        Document attemptDoc = mongoRepo.getQuizAttempt(attemptId);
        JsonObject jsonObj = Json.createReader(new StringReader(attemptDoc.toJson())).readObject();

        return jsonObj;
    }

}
