Quizler: Your Ultimate Study Companion
Welcome to Quizler, a powerful web application designed to revolutionize your study sessions. Built using Spring Boot, JWT, Angular, and Google Auth, Quizler offers a suite of features that cater to students or anyone preparing for exams or learning new topics.

Features
1. Intelligent Quiz Generation
Quizler's core function leverages generative AI to create short quizzes from your study materials or chosen topics. Here's how it works:

Upload Study Materials: Upload your notes, and Quizler will parse the text and data.
- Edit & Generate: Edit the parsed content before sending it to a Generative AI API to create a quiz.
- Answer & Score: Take the quiz, submit your answers, and receive an instant score.
- Review & Retry: All quizzes and scores are stored in a database, allowing you to review past attempts and retry quizzes to track your progress and improve.
- Additionally, you can generate quizzes by entering a topic name, and Quizler will create relevant questions for you.

2. Calendar Scheduling Tool
Organize your study sessions and consultations with the built-in calendar scheduling tool:

- Schedule Events: Input the study/consultation date, time, and attendees' emails.
- Google Calendar Integration: The app uses Google OAuth to schedule events directly in your Google Calendar.
- Email Invitations: Automatically sends email invitations to all attendees, allowing them to accept the calendar invite seamlessly.
  
3. Video Call Functionality
Quizler includes a video call feature, enabling real-time collaboration and consultation:

- Study with Friends: Host study sessions with your friends through video calls.
- Consult with Professors: Use the video call feature for one-on-one consultations with your professors.
- PeerJS Integration: The video call functionality is implemented using PeerJS, a wrapper library for WebRTC, ensuring high-quality and secure video communication.

Technologies Used
Backend: Spring Boot, JWT for security
Frontend: Angular
Authentication: Google Auth
Video Calls: PeerJS (WebRTC wrapper)

Demo Videos


https://github.com/anikalthh/quizler/assets/95908881/f2ae3844-5181-4328-a53b-d38962cba6e2

