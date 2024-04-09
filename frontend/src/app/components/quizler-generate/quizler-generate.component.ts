import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { quizinfo, QuestionsMCQ, GeneratedQuiz } from '../../models';
import { FileUploadService } from '../../services/file-upload.service';
import { QuizService } from '../../services/quiz.service';
import { AxiosService } from '../../services/axios.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-quizler-generate',
  templateUrl: './quizler-generate.component.html',
  styleUrl: './quizler-generate.component.css'
})
export class QuizlerGenerateComponent implements OnInit {
  // dependencies
  private fSvc = inject(FileUploadService)
  private activateRoute = inject(ActivatedRoute)
  private fb = inject(FormBuilder)
  private qSvc = inject(QuizService)
  private router = inject(Router)
  private axiosSvc = inject(AxiosService)
  private _location = inject(Location)

  // vars
  form !: FormGroup
  extractedText!: string
  difficulty!: string
  docId !: string
  typeBased = 'contextBased'
  isLoading: boolean = false;

  // load() {
  //   this.isLoading = true;

  //   setTimeout(() => {
  //     this.isLoading = false
  //   }, 2000);
  // }

  // Option Vars
  difficultyOptions: any[] = [
    { name: 'Easy', value: 'easy' },
    { name: 'Medium', value: 'medium' },
    { name: 'Hard', value: 'hard' }
  ]

  languageOptions: any[] = [
    { name: 'Auto-detect', value: 'Auto' },
    { name: 'English', value: 'English' },
    { name: 'Chinese', value: 'Chinese' },
    { name: 'Bahasa Melayu', value: 'Malay' },
    { name: 'Tamil', value: 'Tamil' },
    { name: 'Hindi', value: 'Hindi' },
    { name: 'Thai', value: 'Thai' },
    { name: 'Korean', value: 'Korean' },
    { name: 'Japanese', value: 'Japanese' },
    { name: 'Tagalog', value: 'Filipino' },
    { name: 'Spanish', value: 'Spanish' }
  ]

  qnTypeOptions: any[] = [
    { name: 'Multiple Choice Questions', value: 'MCQ' },
    { name: 'True/False', value: 'TF' }
  ]

  // lifecycle hooks
  ngOnInit(): void {
    this.form = this.createForm()
    const docId = this.activateRoute.snapshot.params['docId']
    this.fSvc.getExtractedText(docId).then(
      (text) => {
        console.log('>>> text: ', text)

        // Get Extracted Text from SpringBoot
        this.extractedText = text['text']

        // Get Document ID from SpringBoot
        this.docId = text['document_id']

        this.form = this.createForm()
      }
    )
  }

  // methods
  createForm(): FormGroup {
    return this.fb.group({
      quizTitle: this.fb.control('', [Validators.required]),
      extractedText: this.fb.control(this.extractedText, [Validators.required]),
      documentId: this.fb.control(this.docId),
      questionType: this.fb.control('MCQ', [Validators.required]),
      difficulty: this.fb.control('', [Validators.required]),
      language: this.fb.control('', [Validators.required]),
      type: this.fb.control('contextBased'),
      userId: this.fb.control(this.axiosSvc.getUserId())
    })
  }

  generateQuiz() {
    this.isLoading = true;

    // setTimeout(() => {
    //   this.isLoading = false
    // }, 2000);

    const info = this.form.value as quizinfo
    console.log('>>> button clicked: ', info)

    this.qSvc.generateQuizContextBased(info).then(
      (quizQuestions: GeneratedQuiz) => {
        console.log('>>> generated: ', quizQuestions)
        this.isLoading = true
        this.qSvc.updateQuizQuestions(quizQuestions)
        this.router.navigate(['/quiz', `${quizQuestions.quizId}`])
      }
    )

  }

  backButton() {
    this._location.back()
  }
}
