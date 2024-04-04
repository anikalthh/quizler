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
    
    // 1. Convert Json to Document
    // 1a. Quiz
    public static Document quizToDocument(String userId, JsonObject quizinfo, JsonArray qnJson) {

        String documentId = quizinfo.getString("documentId");
        String quizTitle = quizinfo.getString("quizTitle");
        String extractedText = quizinfo.getString("extractedText");
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
        quizDoc.put("quizTitle", quizTitle);
        quizDoc.put("extractedText", extractedText);
        quizDoc.put("difficulty", difficulty);
        quizDoc.put("type", type);
        quizDoc.put("questionType", questionType);
        quizDoc.put("language", language);
        quizDoc.put("data", dataFormatted);

        return quizDoc;
    }

    // 1b. QuizAttempt
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

    // 2. Convert Document to Json
    // 2a. Quiz
    public static JsonObject quizToJson(Document quizDoc) {
        String userId = quizDoc.getString("userId");
        
        String quizId = quizDoc.getObjectId("_id").toString();
        String documentId = quizDoc.getString("documentId");
        String extractedText = quizDoc.getString("extractedText");
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
            .add("extractedText", extractedText)
            .add("difficulty", difficulty)
            .add("type", type)
            .add("questionType", questionType)
            .add("language", language)
            .add("data", data)
            .build();

        System.out.printf("\n\nQUIZ JSON: %s\n\n", quizJson);
        return quizJson;
    }

    // 2b. Document (s3 files data in mongo)
    public static JsonObject s3dataToJson(Document s3data) {
        String userId = s3data.getString("userId");
        String title = (s3data.getString("title") == null) ? "Untitled Document" : s3data.getString("title");
        String s3Id = s3data.getString("S3Id");

        JsonObject s3dataJson = Json.createObjectBuilder()
            .add("userId", userId)
            .add("title", title)
            .add("S3Id", s3Id)
            .build();

        return s3dataJson;
    }
}
