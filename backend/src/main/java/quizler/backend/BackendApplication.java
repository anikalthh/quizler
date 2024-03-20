package quizler.backend;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import quizler.backend.repo.S3Repository;
import quizler.backend.service.OpExamsAPI;
import quizler.backend.service.TextExtractionService;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

	@Autowired
	private TextExtractionService tSvc;

	@Autowired
	private S3Repository s3;

	@Autowired
	private OpExamsAPI api;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	public void run(String... args) throws IOException {
		// ------ testing text extraction ------
		// tSvc.extractTextFromLocal();
		// InputStream is = s3.getFromS3("a223fe30");
		// String text = tSvc.extractText(is);
		
		// ------ testing out API ------
		// api.generateQuestions(text, "MCQ", "English", "easy", "testing123");
		System.out.printf("APP IS RUNNING");
	}

}
