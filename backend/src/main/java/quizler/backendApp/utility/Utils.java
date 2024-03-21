package quizler.backendApp.utility;

import java.util.List;
import java.util.LinkedList;

import org.bson.Document;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonValue;

public class Utils {
    
    // Convert Json to Document
    // 1. Quiz
    public static Document quizToDocument(String userId, JsonObject quizinfo, JsonArray qnJson) {

        String documentId = quizinfo.getString("documentId");
        String difficulty = quizinfo.getString("difficulty");
        String type = quizinfo.getString("type");
        String questionType = quizinfo.getString("questionType");
        String language = quizinfo.getString("language");
        
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
                String optionStr = option.toString();
                optionsList.add(optionStr.substring(1, (optionStr.length()-1)));
            }
            qnDoc.put("options", optionsList);
            dataFormatted.add(qnDoc);
        }

        // CREATING THE MAIN DOCUMENT OBJECT
        Document quizDoc = new Document();
        quizDoc.put("userId", userId);
        quizDoc.put("documentId", documentId);
        quizDoc.put("difficulty", difficulty);
        quizDoc.put("type", type);
        quizDoc.put("questionType", questionType);
        quizDoc.put("language", language);
        quizDoc.put("data", dataFormatted);

        return quizDoc;
    }

    // 2. QuizAttempt
    public static Document quizAttemptToDocument(JsonObject quizAttempt) {

        JsonArray answersArray = quizAttempt.getJsonArray("answers");
        List<Document> answers = new LinkedList<>();
        for (JsonValue jsonVal : answersArray) {
            JsonObject answer = jsonVal.asJsonObject();
            int index = answer.getInt("index");
            String question = answer.getString("question");
            String selectedOption = answer.getString("selectedOption");
            String correctAnswer = answer.getString("correctAnswer");
            Boolean isCorrect = answer.getBoolean("isCorrect");

            Document answerDoc = new Document();
            answerDoc.put("index", index);
            answerDoc.put("question", question);
            answerDoc.put("selectedOption", selectedOption);
            answerDoc.put("correctAnswer", correctAnswer);
            answerDoc.put("isCorrect", isCorrect);
            answers.add(answerDoc);
        }
        
        Document doc = new Document();
        doc.put("documentId", quizAttempt.getString("documentId"));
        doc.put("quizId", quizAttempt.getString("quizId"));
        doc.put("answers", answers);

        return doc;
    }

    // Convert Document to Json
    // 1. Quiz
    public static JsonObject quizToJson(Document quizDoc) {
        String userId = quizDoc.getString("userId");
        System.out.printf("OBJECT ID?? %s\n\n", quizDoc);
        String quizId = quizDoc.getObjectId("_id").toString();
        String documentId = quizDoc.getString("documentId");
        String difficulty = quizDoc.getString("difficulty");
        String type = quizDoc.getString("type");
        String questionType = quizDoc.getString("questionType");
        String language = quizDoc.getString("language");
        List<Document> dataFormatted = quizDoc.getList("data", Document.class);

        JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();
        for (Document qn : dataFormatted) {
            String qnId = qn.getString("id");
            String question = qn.getString("question");
            String answer = qn.getString("answer");
            List<String> options = qn.getList("options", String.class);

            JsonArrayBuilder optionsJsonArrBuilder = Json.createArrayBuilder();
            for (String option : options) {
                optionsJsonArrBuilder.add(Json.createValue(option));
            }
            JsonArray optionsJsonArr = optionsJsonArrBuilder.build();

            JsonObject qnJson = Json.createObjectBuilder()
                .add("id", qnId)
                .add("question", question)
                .add("answer", answer)
                .add("options", optionsJsonArr)
                .build();

            jsonArrayBuilder.add(qnJson);
        }

        JsonArray data = jsonArrayBuilder.build();
        JsonObject quizJson = Json.createObjectBuilder()
            .add("userId", userId)
            .add("quizId", quizId)
            .add("documentId", documentId)
            .add("difficulty", difficulty)
            .add("type", type)
            .add("questionType", questionType)
            .add("language", language)
            .add("data", data)
            .build();

        return quizJson;
    }
}
