import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideocallComponent } from './components/videocall/videocall.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { QuizlerComponent } from './components/quizler/quizler.component';
import { QuizlerGenerateComponent } from './components/quizler-generate/quizler-generate.component';
import { QuizlerQuizComponent } from './components/quizler-quiz/quizler-quiz.component';
import { QuizlerDocsComponent } from './components/quizler-docs/quizler-docs.component';

const routes: Routes = [
  {path: '', component: LandingpageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'home', component: HomepageComponent},
  {path: 'quiz', component: QuizlerComponent},
  {path: 'uploads', component:QuizlerDocsComponent},
  {path: 'generate/:docId', component: QuizlerGenerateComponent},
  {path: 'quiz/:quizId', component: QuizlerQuizComponent},
  {path: 'videocall', component: VideocallComponent},
  {path: '**', redirectTo: '/', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
