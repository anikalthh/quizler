package quizler.backendApp.service;

import java.io.InputStream;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import quizler.backendApp.repo.MongoRepository;
import quizler.backendApp.repo.S3Repository;

@Service
public class FileService {

    @Autowired
    private MongoRepository fRepo;

    @Autowired
    private S3Repository s3;
    
    public String save(String username, String title, InputStream is, long length, String contentType) {
        // save to S3
        String s3Id = s3.saveToS3(username, is, contentType, length);

        // save in Mongo 
        fRepo.saveDocument(username, title, s3Id);

        // fRepo.save(fileId, is, contentType);
        return s3Id;
    }

    public InputStream getFileInputStreamFromS3(String id) {
        return s3.getFromS3(id);
    }

}
