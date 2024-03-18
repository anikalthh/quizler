package quizler.backend.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

@Service
public class TextExtractionService {

    @Autowired
    private ResourceLoader resourceLoader;

    public void extractTextFromLocal() throws IOException {
        Resource resource = resourceLoader.getResource("classpath:Test.pdf");
        File file = resource.getFile();
        // File file = new File("Test.pdf");
        PDDocument document = PDDocument.load(file);
        PDFTextStripper pdfStripper = new PDFTextStripper();
        String text = pdfStripper.getText(document);
        System.out.printf("\n>>>>> TEXT FROM PDF:\n%s\n\n", text);
        document.close();
    }

    public String extractText(InputStream is) throws IOException {
        PDDocument document = PDDocument.load(is);
        PDFTextStripper pdfStripper = new PDFTextStripper();
        String text = pdfStripper.getText(document);
        // System.out.printf("\n>>>>> TEXT FROM PDF:\n%s\n\n", text);
        document.close();

        return text;
    }

}
