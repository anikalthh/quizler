package quizler.backend.model;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.bson.Document;

import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonValue;
import lombok.Data;

@Data
public class Quiz {

    String userId;
    String documentId;
    String quizId;
    String difficulty;
    String type;
    String questionType;
    String language;
    JsonArray data;

    // Constructor
    public Quiz(String userId, String documentId, String difficulty, String type, String questionType, String language,
            JsonArray data) {
        this.userId = userId;
        this.documentId = documentId;
        this.difficulty = difficulty;
        this.type = type;
        this.questionType = questionType;
        this.language = language;
        this.data = data;
        this.quizId = UUID.randomUUID().toString();
    }

    // Methods

    public static Document fromJsonToDocument(String userId, JsonObject quizinfo, JsonArray qnJson) {

        String documentId = quizinfo.getString("documentId");
        String difficulty = quizinfo.getString("difficulty");
        String type = quizinfo.getString("type");
        String questionType = quizinfo.getString("questionType");
        String language = quizinfo.getString("language");

        Quiz quizData = new Quiz(userId, documentId, difficulty, type, questionType, language, qnJson);

        // CREATING THE ARRAY OF QN DOCUMENTS
        List<Document> dataFormatted = new LinkedList<>();
        for (JsonValue jsonVal : qnJson) {
            JsonObject qn = jsonVal.asJsonObject();
            Document qnDoc = new Document();
            String qnId = qn.getString("id");
            String question = qn.getString("question");
            String answer = qn.getString("answer");
            JsonArray options = qn.getJsonArray("options");

            qnDoc.put("id", qnId);
            qnDoc.put("question", question);
            qnDoc.put("answer", answer);

            List<String> optionsList = new LinkedList<>();
            for (JsonValue option : options) {
                optionsList.add(option.toString());
            }
            qnDoc.put("options", optionsList);
            dataFormatted.add(qnDoc);
        }

        // CREATING THE MAIN DOCUMENT OBJECT
        Document quizDoc = new Document();
        quizDoc.put("user_id", userId);
        quizDoc.put("document_id", documentId);
        // quizDoc.put("quiz_id", UUID.randomUUID().toString());
        quizDoc.put("difficulty", difficulty);
        quizDoc.put("type", type);
        quizDoc.put("question_type", questionType);
        quizDoc.put("language", language);
        quizDoc.put("data", dataFormatted);

        return quizDoc;
    }
}
