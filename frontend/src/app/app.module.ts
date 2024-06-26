import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideocallComponent } from './components/videocall/videocall.component';

import { CallinfoDialogComponent } from './components/callinfo-dialog/callinfo-dialog.component';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DataViewModule } from 'primeng/dataview';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { PaginatorModule } from 'primeng/paginator';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ChartModule } from 'primeng/chart';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './user-auth-components/login/login.component';
// import { SignupComponent } from './components/signup/signup.component';
import { CallService } from './services/call.service';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { QuizlerComponent } from './components/quizler/quizler.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { QuizlerGenerateComponent } from './components/quizler-generate/quizler-generate.component';
import { QuizlerQuizComponent } from './components/quizler-quiz/quizler-quiz.component';
import { QuizlerDocsComponent } from './components/quizler-docs/quizler-docs.component';
import { RegistrationComponent } from './user-auth-components/registration/registration.component';
import { QuizlerListComponent } from './components/quizler-list/quizler-list.component';
import { QuizlerAttemptsComponent } from './components/quizler-attempts/quizler-attempts.component';
import { QuizlerTopicComponent } from './components/quizler-topic/quizler-topic.component';
import { GoogleCalComponent } from './components/google-cal/google-cal.component';
import { ViewAttemptComponent } from './components/view-attempt/view-attempt.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AuthNotifComponent } from './components/auth-notif/auth-notif.component';

@NgModule({
  declarations: [
    AppComponent,
    VideocallComponent,
    CallinfoDialogComponent,
    HomepageComponent,
    LoginComponent,
    // SignupComponent,
    LandingpageComponent,
    QuizlerComponent,
    ToolbarComponent,
    QuizlerGenerateComponent,
    QuizlerQuizComponent,
    QuizlerDocsComponent,
    RegistrationComponent,
    QuizlerListComponent,
    QuizlerAttemptsComponent,
    QuizlerTopicComponent,
    GoogleCalComponent,
    ViewAttemptComponent,
    AuthNotifComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    // MatButtonModule,
    MatDialogModule,
    // MatFormFieldModule,
    MatInputModule,
    ClipboardModule,
    // MatSnackBarModule,
    // MatGridListModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    FloatLabelModule,
    DataViewModule,
    ToolbarModule,
    FileUploadModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextareaModule,
    RadioButtonModule,
    SelectButtonModule,
    DropdownModule,
    SplitButtonModule,
    CalendarModule,
    ChipsModule,
    DialogModule,
    ToastModule,
    ProgressBarModule,
    PaginatorModule,
    DividerModule,
    ScrollPanelModule,
    ChartModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    provideAnimationsAsync(),
    CallService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
