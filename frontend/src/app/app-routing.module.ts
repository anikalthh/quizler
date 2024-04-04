import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideocallComponent } from './components/videocall/videocall.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './user-auth-components/login/login.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { QuizlerComponent } from './components/quizler/quizler.component';
import { QuizlerGenerateComponent } from './components/quizler-generate/quizler-generate.component';
import { QuizlerQuizComponent } from './components/quizler-quiz/quizler-quiz.component';
import { QuizlerDocsComponent } from './components/quizler-docs/quizler-docs.component';
import { RegistrationComponent } from './user-auth-components/registration/registration.component';
import { canAccess } from './auth.guard';
import { QuizlerListComponent } from './components/quizler-list/quizler-list.component';

const routes: Routes = [
  {path: '', component: LandingpageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: RegistrationComponent},
  {path: "", canActivate: [ canAccess ],
    children: [
      {path: 'home', component: HomepageComponent},
      {path: 'quiz', component: QuizlerComponent},
      {path: 'uploads', component:QuizlerDocsComponent},
      {path: ':docId/quizzes', component: QuizlerListComponent},
      {path: 'generate/:docId', component: QuizlerGenerateComponent},
      {path: 'quiz/:quizId', component: QuizlerQuizComponent},
      {path: 'videocall', component: VideocallComponent}
  ]},
  {path: '**', redirectTo: '/', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
