import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideocallComponent } from './components/videocall/videocall.component';
import { HomepageComponent } from './components/homepage/homepage.component';
// import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './user-auth-components/login/login.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { QuizlerComponent } from './components/quizler/quizler.component';
import { QuizlerGenerateComponent } from './components/quizler-generate/quizler-generate.component';
import { QuizlerQuizComponent } from './components/quizler-quiz/quizler-quiz.component';
import { QuizlerDocsComponent } from './components/quizler-docs/quizler-docs.component';
import { RegistrationComponent } from './user-auth-components/registration/registration.component';
import { canAccess } from './auth.guard';
import { QuizlerListComponent } from './components/quizler-list/quizler-list.component';
import { QuizlerAttemptsComponent } from './components/quizler-attempts/quizler-attempts.component';
import { QuizlerTopicComponent } from './components/quizler-topic/quizler-topic.component';
import { GoogleCalComponent } from './components/google-cal/google-cal.component';
import { ViewAttemptComponent } from './components/view-attempt/view-attempt.component';

const routes: Routes = [
  {path: '', component: LandingpageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: RegistrationComponent},
  {path: "", canActivate: [ canAccess ],
    children: [
      {path: 'home', component: HomepageComponent},
      {path: 'quiz', component: QuizlerComponent}, // upload doc
      {path: 'uploads', component:QuizlerDocsComponent}, // list of docs uploaded
      {path: ':docId/quizzes', component: QuizlerListComponent},
      {path: 'generate/:docId', component: QuizlerGenerateComponent}, // generate quiz by content
      {path: 'generate', component: QuizlerTopicComponent}, // generate quiz by topic
      {path: 'quiz/:quizId/attempts', component: QuizlerAttemptsComponent}, // view all attempts under a quiz
      {path: 'attempt/:attemptId', component: ViewAttemptComponent}, // view specific quiz attempt
      {path: 'quiz/:quizId', component: QuizlerQuizComponent},
      {path: 'videocall', component: VideocallComponent},
      {path: 'calendar', component: GoogleCalComponent}
  ]},
  {path: '**', redirectTo: '/', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
