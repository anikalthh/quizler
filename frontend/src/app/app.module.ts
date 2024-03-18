import { NgModule } from '@angular/core';
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

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CallService } from './services/call.service';
import { TrendingComponent } from './components/trending/trending.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { QuizlerComponent } from './components/quizler/quizler.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { QuizlerGenerateComponent } from './components/quizler-generate/quizler-generate.component';
import { QuizlerQuizComponent } from './components/quizler-quiz/quizler-quiz.component';

@NgModule({
  declarations: [
    AppComponent,
    VideocallComponent,
    CallinfoDialogComponent,
    HomepageComponent,
    LoginComponent,
    SignupComponent,
    TrendingComponent,
    LandingpageComponent,
    QuizlerComponent,
    ToolbarComponent,
    QuizlerGenerateComponent,
    QuizlerQuizComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ClipboardModule,
    MatSnackBarModule,
    MatGridListModule,
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
    DropdownModule
  ],
  providers: [
    provideAnimationsAsync(),
    CallService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
