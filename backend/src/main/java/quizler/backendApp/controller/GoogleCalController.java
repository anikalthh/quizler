package quizler.backendApp.controller;

import java.io.IOException;
import java.io.StringReader;
import java.net.URISyntaxException;
import java.security.GeneralSecurityException;
import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.servlet.view.RedirectView;

import com.google.api.client.auth.oauth2.AuthorizationCodeRequestUrl;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets.Details;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Event.Creator;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonString;
import jakarta.json.JsonValue;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import quizler.backendApp.dto.UrlDto;
import quizler.backendApp.service.EmailService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api")
public class GoogleCalController {

    @Value("${google.client.client-id}")
    private String clientId;

    @Value("${google.client.client-secret}")
    private String clientSecret;

    @Value("${base.url}")
    private String baseUrl;

    @Value("${redirect.angular.url}")
    private String redirectAngularUrl;

    private String redirectURI = baseUrl + "/api/auth/callback";

    private static Calendar gCalClient;
    GoogleClientSecrets clientSecrets;
    GoogleAuthorizationCodeFlow flow;
    Credential credential;

    private final static Log logger = LogFactory.getLog(GoogleCalController.class);
    private static final String APPLICATION_NAME = "Quizler";
    private static HttpTransport httpTransport;

    @Autowired
    private EmailService emailSvc;

    // GOOGLE OAUTH2
    @GetMapping("/auth/url")
    public ResponseEntity<UrlDto> auth() throws GeneralSecurityException, IOException {

        AuthorizationCodeRequestUrl authorizationUrl;
        if (flow == null) {
            Details web = new Details();
            web.setClientId(clientId);
            web.setClientSecret(clientSecret);
            clientSecrets = new GoogleClientSecrets().setWeb(web);
            httpTransport = GoogleNetHttpTransport.newTrustedTransport();
            Collection<String> scopes = new HashSet<>();
            scopes.add(CalendarScopes.CALENDAR);
            // scopes.add(CalendarScopes.CALENDAR_EVENTS);
            flow = new GoogleAuthorizationCodeFlow.Builder(httpTransport, new GsonFactory(), clientSecrets,
                    scopes).build();
        }
        System.out.printf("\n\nwhy redirect uri wrongg: %s\n\n", baseUrl + "/api/auth/callback");
        authorizationUrl = flow.newAuthorizationUrl().setRedirectUri(baseUrl + "/api/auth/callback");

        return ResponseEntity.ok(new UrlDto(authorizationUrl.build()));

    }

    @GetMapping("/auth/callback")
    public RedirectView callback(@RequestParam("code") String code) throws URISyntaxException {
        try {
            TokenResponse token = flow.newTokenRequest(code).setRedirectUri(baseUrl + "/api/auth/callback").execute();
            credential = flow.createAndStoreCredential(token, "userID");
            gCalClient = new Calendar.Builder(httpTransport, new GsonFactory(),
                    credential)
                    .setApplicationName(APPLICATION_NAME).build();
            return new RedirectView(redirectAngularUrl + "/#/calendar?auth=Success");
            // return new RedirectView("/#/calendar?auth=Success");

        } catch (Exception e) {
            logger.warn("Exception while handling OAuth2 callback (" + e.getMessage() + ")."
                    + " Redirecting to google connection status page.");
            return new RedirectView(redirectAngularUrl + "/#/calendar?auth=Failure");
            // return new RedirectView("/#/calendar?auth=Failure");

        }
    }

    // Post Mapping to process event details sent from frontend and post data to
    // google calendar
    @PostMapping("/schedule/google/calendar")
    public void insertGoogleCal(@RequestBody String payload) throws IOException, MessagingException {
        JsonObject jsonObj = Json.createReader(new StringReader(payload)).readObject();
        String meetingTitle = jsonObj.getString("meetingTitle");
        String startDateTime = jsonObj.getString("startDatetime");
        String endDateTime = jsonObj.getString("endDatetime");
        System.out.printf("\nDATETIME FORMAT: %s\n", startDateTime);
        String email = jsonObj.getString("email");
        JsonArray attendees = jsonObj.getJsonArray("attendee");
        System.out.printf("\n\n attendess json array: %s\n\n", attendees);

        // Format Datetime
        // Convert the string into a DateTime object
        DateTime startFormattedDateTime = new DateTime(startDateTime);
        DateTime endFormattedDateTime = new DateTime(endDateTime);

        // Create an EventDateTime object and set the DateTime
        EventDateTime start = new EventDateTime().setDateTime(startFormattedDateTime);
        EventDateTime end = new EventDateTime().setDateTime(endFormattedDateTime);

        // attendees
        List<EventAttendee> listOfAttendees = new LinkedList<>();

        for (JsonValue attendee : attendees) {
            EventAttendee eventAttendee = new EventAttendee();
            eventAttendee.setEmail(((JsonString) attendee).getString()); // Have to cast to JsonString before getString() to remove additional quotation marks around the email
            listOfAttendees.add(eventAttendee);
            // System.out.printf("email???: %s\n\n", eventAttendee.get("email"));
        }

        Creator eventCreator = new Creator();
        eventCreator.setEmail(email);

        // Create Google Event Object
        Event googleEvent = new Event();
        googleEvent.setSummary(meetingTitle);
        googleEvent.setStart(start);
        googleEvent.setEnd(end);
        googleEvent.setAttendees(listOfAttendees);

        System.out.printf("GOOGLE EVENT CREATED: %s\n\n", googleEvent);
        
        // INSERT CALENDAR EVENT INTO GOOGLE CALENDAR
        gCalClient.events().insert("primary", googleEvent).execute();

        // SEND EMAIL TO ATTENDEES TO NOTIFY THEM TO ACCEPT INVITE
        for (EventAttendee attendee : listOfAttendees) {
            emailSvc.sendEmail(attendee.getEmail());
            System.out.printf("\n\nsending email to: %s\n", attendee.getEmail());
        }
    }
}
