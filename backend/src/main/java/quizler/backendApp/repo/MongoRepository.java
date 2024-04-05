package quizler.backendApp.repo;

import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.mongodb.client.result.DeleteResult;
import com.mongodb.internal.bulk.DeleteRequest;

@Repository
public class MongoRepository {
    
    @Autowired
    private MongoTemplate mt;

    // USER DATA: "users"

    // DOCUMENT/ S3 FILES DATA: "s3files"
    public void saveDocument(String userId, String title, String s3Id, String extractedText) {
        Document doc = new Document();
        doc.put("userId", userId);
        doc.put("title", title);
        doc.put("S3Id", s3Id);
        doc.put("extractedText", extractedText);

        mt.insert(doc, "s3files");
    }

    public List<Document> getAllDocuments(String userId) {
        MatchOperation matchOps = Aggregation.match(Criteria.where("userId").is(userId));
        Aggregation pipeline = Aggregation.newAggregation(matchOps);
        AggregationResults<Document> results = mt.aggregate(pipeline, "s3files", Document.class);

        return results.getMappedResults();
    }

    public Document getDocument(String docId) {
        MatchOperation matchOps = Aggregation.match(Criteria.where("S3Id").is(docId));
        Aggregation pipeline = Aggregation.newAggregation(matchOps);
        AggregationResults<Document> results = mt.aggregate(pipeline, "s3files", Document.class);

        return results.getMappedResults().getFirst();
    }

    // QUIZ DATA: "quiz"
    // Returns quizId generated by Mongo
    public String saveQuiz(Document quizDoc) {
        Document insertedDoc = mt.insert(quizDoc, "quiz");
        return insertedDoc.getObjectId("_id").toString();
    }

    public Document getQuiz(String quizId) {
        MatchOperation matchOps = Aggregation.match(Criteria.where("_id").is(quizId));

        Aggregation pipeline = Aggregation.newAggregation(matchOps);

        AggregationResults<Document> results = mt.aggregate(pipeline, "quiz", Document.class);

        return results.getMappedResults().getFirst();
    }

    public long deleteQuiz(String quizId) {
        Query query = Query.query(Criteria.where("_id").is(quizId));
        DeleteResult result = mt.remove(query, "quiz");
        System.out.printf("\n\ndeleting quizId: %s\n\ndeletecount: %s\n\n", quizId, result.getDeletedCount());
        return result.getDeletedCount();
    }

    // Get all quizzes under a document
    public List<Document> getAllQuizzes(String docId) {
        MatchOperation matchOps = Aggregation.match(Criteria.where("documentId").is(docId));
        Aggregation pipeline = Aggregation.newAggregation(matchOps);
        AggregationResults<Document> results = mt.aggregate(pipeline, "quiz", Document.class);
        // System.out.printf("\n\ndocId: %s\n\n", docId);
        // System.out.printf("GET ALL QUIZZES RESULTS: %s\n\n", results.getMappedResults());

        return results.getMappedResults();
    }

    // SCORES DATA: "scores"
    // Returns Quiz Attempt ID generated by Mongo
    public String saveQuizAttempt(Document quizAttemptDoc) {
        Document insertedDoc = mt.insert(quizAttemptDoc, "attempts");
        return insertedDoc.getObjectId("_id").toString();
    }

    // Retrives Quiz Attempts
    public List<Document> getAllAttempts(String quizId) {
        MatchOperation matchOps = Aggregation.match(Criteria.where("quizId").is(quizId));
        Aggregation pipeline = Aggregation.newAggregation(matchOps);
        AggregationResults<Document> results = mt.aggregate(pipeline, "attempts", Document.class);

        return results.getMappedResults();
    }
}
