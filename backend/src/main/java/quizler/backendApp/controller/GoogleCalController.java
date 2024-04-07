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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
import quizler.backendApp.dto.UrlDto;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api")
public class GoogleCalController {

    @Value("${google.client.client-id}")
    private String clientId;
    @Value("${google.client.client-secret}")
    private String clientSecret;

    private String redirectURI = "http://localhost:8080/api/auth/callback";

    private static Calendar gCalClient;
    GoogleClientSecrets clientSecrets;
    GoogleAuthorizationCodeFlow flow;
    Credential credential;

    private final static Log logger = LogFactory.getLog(GoogleCalController.class);
    private static final String APPLICATION_NAME = "Quizler";
    private static HttpTransport httpTransport;

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
        authorizationUrl = flow.newAuthorizationUrl().setRedirectUri(redirectURI);

        return ResponseEntity.ok(new UrlDto(authorizationUrl.build()));

    }

    @GetMapping("/auth/callback")
    public RedirectView callback(@RequestParam("code") String code) throws URISyntaxException {
        try {
            TokenResponse token = flow.newTokenRequest(code).setRedirectUri(redirectURI).execute();
            credential = flow.createAndStoreCredential(token, "userID");
            gCalClient = new Calendar.Builder(httpTransport, new GsonFactory(),
                    credential)
                    .setApplicationName(APPLICATION_NAME).build();
            return new RedirectView("http://localhost:4200/#/calendar?auth=Success");
        } catch (Exception e) {
            logger.warn("Exception while handling OAuth2 callback (" + e.getMessage() + ")."
                    + " Redirecting to google connection status page.");
            return new RedirectView("http://localhost:4200/#/calendar?auth=Failure");
        }

    }

    // Post Mapping to process event details sent from frontend and post data to
    // google calendar
    @PostMapping("/schedule/google/calendar")
    public void insertGoogleCal(@RequestBody String payload) throws IOException {
        JsonObject jsonObj = Json.createReader(new StringReader(payload)).readObject();
        String meetingTitle = jsonObj.getString("meetingTitle");
        String dateTime = jsonObj.getString("datetime");
        int duration = jsonObj.getInt("duration");
        String email = jsonObj.getString("email");
        JsonArray attendees = jsonObj.getJsonArray("attendee");
        System.out.printf("\n\n attendess json array: %s\n\n", attendees);

        // Format Datetime
        // Convert the string into a DateTime object
        DateTime formattedDateTime = new DateTime(dateTime);

        // Create an EventDateTime object and set the DateTime
        EventDateTime eventDateTime = new EventDateTime()
                .setDateTime(formattedDateTime);

        // attendees
        List<EventAttendee> listOfAttendees = new LinkedList<>();

        for (JsonValue attendee : attendees) {
            EventAttendee eventAttendee = new EventAttendee();
            eventAttendee.setEmail(((JsonString) attendee).getString()); // Have to cast to JsonString before getString() to remove additional quotation marks around the email
            listOfAttendees.add(eventAttendee);
        }

        Creator eventCreator = new Creator();
        eventCreator.setEmail(email);

        // Create Google Event Object
        Event googleEvent = new Event();
        googleEvent.setSummary(meetingTitle);
        googleEvent.setStart(eventDateTime);
        googleEvent.setEnd(eventDateTime);
        googleEvent.setAttendees(listOfAttendees);

        System.out.printf("GOOGLE EVENT CREATED: %s\n\n", googleEvent);
        gCalClient.events().insert("primary", googleEvent).execute();
    }
}
