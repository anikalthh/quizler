package quizler.backendApp.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import quizler.backendApp.exception.DocumentDeletionException;
import quizler.backendApp.repo.MongoRepository;
import quizler.backendApp.repo.S3Repository;
import quizler.backendApp.utility.Utils;

@Service
public class FileService {

    @Autowired
    private MongoRepository mongoRepo;

    @Autowired
    private S3Repository s3;

    @Autowired
    private TextExtractionService textExtractSvc;

    // Save Document upload
    public String save(String userId, String title, InputStream is, long length, String contentType) throws IOException {
        // save to S3
        String s3Id = s3.saveToS3(userId, is, contentType, length);

        // save in Mongo 
        InputStream inputStreamToSave = getFileInputStreamFromS3(s3Id);

        String extractedText = textExtractSvc.extractText(inputStreamToSave);
        mongoRepo.saveDocument(userId, title, s3Id, extractedText);

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
            JsonObject documentJson = Json.createReader(new StringReader(Utils.s3dataToJson(doc))).readObject();
            jsonArrayBuilder.add(documentJson);
        }
        JsonArray jsonArray = jsonArrayBuilder.build();

        return jsonArray;
    }

    // Get a specific document by Document ID
    public String getDocument(String docId) {
        Document documentBSON = mongoRepo.getDocument(docId);

        // JsonObject jsonObj = Json.createReader(new StringReader(documentBSON.toJson())).readObject();
        return documentBSON.toJson();
    }

    // Delete document from digiOcean and document data from mongo
    @Transactional(rollbackFor = DocumentDeletionException.class)
    public Boolean deleteDocumentAndQuizzes(String docId) throws DocumentDeletionException {

        // delete document from s3
        s3.deleteFromS3(docId);

        // delete document data from mongo
        Boolean isDocumentDataDeleted = mongoRepo.deleteDocument(docId);

        // delete quizzes under document
        Boolean areQuizzesDeleted = mongoRepo.deleteQuizzesOfADocument(docId);

        // delete quiz attempts under document
        Boolean areQuizAttemptsDeleted = mongoRepo.deleteQuizAttempts(docId, "document");

        if (!isDocumentDataDeleted || !areQuizzesDeleted || !areQuizAttemptsDeleted) {
            throw new DocumentDeletionException();
        } else {
            return true;
        }
    }
}
