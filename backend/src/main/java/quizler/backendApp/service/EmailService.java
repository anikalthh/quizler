package quizler.backendApp.service;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to) throws MessagingException, UnsupportedEncodingException {

        // MIME MSG
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        
        helper.setTo(to);
        helper.setSubject("Quizler Invite!");
        helper.setText("Hello, you've been invited to a study session with me! Please accept the google calendar invite :-)");
        
        mailSender.send(message);
    }
}
