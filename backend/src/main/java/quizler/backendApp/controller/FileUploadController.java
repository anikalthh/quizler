package quizler.backendApp.controller;

import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.codec.language.bm.Rule.RPattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import quizler.backendApp.exception.DocumentDeletionException;
import quizler.backendApp.service.FileService;
import quizler.backendApp.service.TextExtractionService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FileUploadController {

    @Autowired
    private FileService fSvc;

    @Autowired
    private TextExtractionService textExtractSvc;
    
    // Post Mapping to retrieve and save file uploaded
    @PostMapping(path = "/file/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> saveFile(@RequestPart(required = false) MultipartFile file, @RequestPart(required = false) String title, @RequestPart String userId) throws IOException {
        String mediaType = file.getContentType();
        InputStream is = file.getInputStream();
        long size = file.getSize();

        // System.out.printf(">>>>> FILE DEETS:\nmedia type -- %s\nis == %s\nsize -- %s\n\nUSERID: %s\n\n", mediaType, is, size, userId);

        String s3Id = fSvc.save(userId, title, is, size, mediaType);

        JsonObject jsonObj = Json.createObjectBuilder().add("docId", s3Id).build();
        return ResponseEntity.ok().body(jsonObj.toString());
    }

    // Get Mapping to retrieve extracted text
    @GetMapping(path = "/file/extracted/{docId}")
    public ResponseEntity<String> getExtractedText(@PathVariable("docId") String docId) throws IOException {

        InputStream is = fSvc.getFileInputStreamFromS3(docId);
        String extractedText = textExtractSvc.extractText(is);
        JsonObject jsonObj = Json.createObjectBuilder()
            .add("text", extractedText)
            .add("document_id", docId)
            .build();
        return ResponseEntity.ok().body(jsonObj.toString());
    }

    // Get all documents uploaded by a user
    @GetMapping(path = "/documents/{userId}")
    public ResponseEntity<String> getAllDocuments(@PathVariable("userId") String userId) {
        
        return ResponseEntity.ok().body(fSvc.getAllDocuments(userId).toString());
    }

    // Get Specific Document Data
    @GetMapping(path = "/document/{docId}")
    public ResponseEntity<String> getDocument(@PathVariable("docId") String docId) {
        return ResponseEntity.ok().body(fSvc.getDocument(docId));
    }

    @DeleteMapping("/document/{docId}")
    public ResponseEntity<String> deleteQuiz(@PathVariable("docId") String docId) throws DocumentDeletionException {

        Boolean deleteSuccess = fSvc.deleteDocumentAndQuizzes(docId);

        JsonObjectBuilder builder = Json.createObjectBuilder();
        JsonObject resp;
        if (!deleteSuccess) {
            resp = builder.add("docId", "error")
                    .build();
        } else {
            resp = builder.add("docId", docId)
                    .build();
        }

        return ResponseEntity.ok().body(resp.toString());
    }
}
