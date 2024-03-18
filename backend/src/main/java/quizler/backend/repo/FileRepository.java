package quizler.backend.repo;

import java.io.InputStream;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class FileRepository {
    
    @Autowired
    private MongoTemplate mt;

    public void save(String username, String title, String s3Id) {
        Document doc = new Document();
        doc.put("username", username);
        doc.put("title", title);
        doc.put("S3_id", s3Id);

        mt.insert(doc, "s3files");
    }
}
