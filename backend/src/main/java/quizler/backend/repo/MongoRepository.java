package quizler.backend.repo;

import java.io.InputStream;

import org.bson.Document;
import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationPipeline;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.redis.connection.zset.Aggregate;
import org.springframework.stereotype.Repository;

import quizler.backend.model.Quiz;

@Repository
public class MongoRepository {
    
    @Autowired
    private MongoTemplate mt;

    // USER DATA: "users"

    // DOCUMENT/ S3 FILES DATA: "s3files"
    public void saveDocument(String username, String title, String s3Id) {
        Document doc = new Document();
        doc.put("username", username);
        doc.put("title", title);
        doc.put("S3_id", s3Id);

        mt.insert(doc, "s3files");
    }

    // QUIZ DATA: "quiz"
    public void saveQuiz(Document quizDoc) {
        System.out.printf("\n\n\nWHAT AM I INSERTING INTO MONGO: %s\n\n\n", quizDoc);
        mt.insert(quizDoc, "quiz");
        System.out.printf("INSERTING QUIZ DATA: %s\n\n", quizDoc.toString());
    }

    public Document getQuiz(String quizId, String documentId) {
        MatchOperation matchOps = Aggregation.match(Criteria.where("_id").is(quizId).andOperator(Criteria.where("document_id").is(documentId)));

        Aggregation pipeline = Aggregation.newAggregation(matchOps);

        AggregationResults<Document> results = mt.aggregate(pipeline, "quiz", Document.class);
        System.out.printf("RETRIEVE QUIZ FROM MONGO: %s\n\n", results.getRawResults());

        return results.getRawResults();
    }

    // SCORES DATA: "scores"
}
