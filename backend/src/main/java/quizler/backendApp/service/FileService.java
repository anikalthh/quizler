package quizler.backendApp.service;

import java.io.InputStream;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import quizler.backendApp.repo.MongoRepository;
import quizler.backendApp.repo.S3Repository;
import quizler.backendApp.utility.Utils;

@Service
public class FileService {

    @Autowired
    private MongoRepository mongoRepo;

    @Autowired
    private S3Repository s3;

    // Save Document upload
    public String save(String userId, String title, InputStream is, long length, String contentType) {
        // save to S3
        String s3Id = s3.saveToS3(userId, is, contentType, length);

        // save in Mongo 
        mongoRepo.saveDocument(userId, title, s3Id);

        // fRepo.save(fileId, is, contentType);
        return s3Id;
    }

    // Get Document from S3
    public InputStream getFileInputStreamFromS3(String id) {
        return s3.getFromS3(id);
    }

    // Get all document BSON data from mongo
    public JsonArray getAllDocuments(String userId) {
        List<Document> allDocumentsBSON = mongoRepo.getAllDocuments(userId);

        JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();
        for (Document doc : allDocumentsBSON) {
            JsonObject documentJson = Utils.s3dataToJson(doc);
            jsonArrayBuilder.add(documentJson);
        }
        JsonArray jsonArray = jsonArrayBuilder.build();

        return jsonArray;
    }
}
