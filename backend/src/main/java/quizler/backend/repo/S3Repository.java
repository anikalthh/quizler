package quizler.backend.repo;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;

@Repository
public class S3Repository {

    @Autowired
    private AmazonS3 s3;

    public String saveToS3(String username, InputStream is, String contentType, long length) {
        ObjectMetadata metadata = new ObjectMetadata();
        Map<String, String> userData = new HashMap<>();

        userData.put("username", username);
        metadata.setContentLength(length);
        metadata.setContentType(contentType);
        metadata.setUserMetadata(userData);

        String id = UUID.randomUUID().toString().substring(0, 8);

        PutObjectRequest putReq = new PutObjectRequest("quizler", "files/%s".formatted(id), is, metadata);
        putReq = putReq.withCannedAcl(CannedAccessControlList.PublicRead);

        // Upload to S3
        s3.putObject(putReq);
        return id;
    }

    public InputStream getFromS3(String key) {

        GetObjectRequest getReq = new GetObjectRequest("quizler", "files/%s".formatted(key));

        S3Object obj = s3.getObject(getReq);
        InputStream is = obj.getObjectContent();
        System.out.printf("\n>>> getting input stream from s3: %s\n\n", is);
        return is;
    }

}
