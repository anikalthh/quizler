package quizler.backendApp.service;

import java.io.StringReader;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.json.Json;
import jakarta.json.JsonObject;

@Service
public class OpExamsAPI {

    @Value("${opexams.api.key}")
    private String apiKey;

    private String baseUrl = "https://api.opexams.com/questions-generator";

    public JsonObject generateQuestionsByContext(String extractedText, String qnType, String language, String difficulty) {

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("api-key", apiKey);
        httpHeaders.add("request-type", "test");
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        JsonObject requestJson = Json.createObjectBuilder()
                .add("type", "contextBased")
                .add("context", extractedText)
                .add("questionType", qnType)
                .add("language", language)
                .add("difficulty", difficulty)
                // .add("requestId", quizId)
                .build();

        RequestEntity<String> requestEntity = RequestEntity
            .post(baseUrl)
            .headers(httpHeaders)
            .body(requestJson.toString());

        RestTemplate template = new RestTemplate();

        ResponseEntity<String> resp = template.exchange(requestEntity, String.class);

        System.out.printf("\n\nOP EXAMS RESPONSE:\n\n%s\n\n", resp.getBody());
        JsonObject qnsJson = Json.createReader(new StringReader(resp.getBody())).readObject();

        return qnsJson;
    }

    public JsonObject generateQuestionsByTopic(String topic, String qnType, String language, String difficulty) {

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("api-key", apiKey);
        httpHeaders.add("request-type", "test");
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        JsonObject requestJson = Json.createObjectBuilder()
                .add("type", "topicBased")
                .add("topic", topic)
                .add("questionType", qnType)
                .add("language", language)
                .add("difficulty", difficulty)
                // .add("requestId", quizId)
                .build();

        RequestEntity<String> requestEntity = RequestEntity
            .post(baseUrl)
            .headers(httpHeaders)
            .body(requestJson.toString());

        RestTemplate template = new RestTemplate();

        ResponseEntity<String> resp = template.exchange(requestEntity, String.class);


        JsonObject qnsJson = Json.createReader(new StringReader(resp.getBody())).readObject();

        return qnsJson;
    }
}
