import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { quizinfo, QuestionsMCQ, QuestionsMCQArray } from '../../models';
import { FileUploadService } from '../../services/file-upload.service';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-quizler-generate',
  templateUrl: './quizler-generate.component.html',
  styleUrl: './quizler-generate.component.css'
})
export class QuizlerGenerateComponent implements OnInit{
  // dependencies
  private fSvc = inject(FileUploadService)
  private activateRoute = inject(ActivatedRoute)
  private fb = inject(FormBuilder)
  private qSvc = inject(QuizService)
  private router = inject(Router)

  // vars
  form !: FormGroup
  extractedText!: string
  difficulty!: string

  // Option Vars
  difficultyOptions : any[] = [
    {name: 'Easy', value: 'easy'},
    {name: 'Medium', value: 'medium'},
    {name: 'Hard', value: 'hard'}
  ]

  languageOptions: any[] = [
    {name: 'English', value: 'English'},
    {name: 'Auto-detect', value: 'Auto'}
  ]

  qnTypeOptions : any[] = [
    {name: 'Multiple Choice Questions', value: 'MCQ'},
    {name: 'True/False', value: 'TF'},
    {name: 'Open-ended', value: 'open'}
  ]

  // lifecycle hooks
  ngOnInit(): void {
    this.form = this.createForm()
    const docId = this.activateRoute.snapshot.params['docId']
    this.fSvc.getExtractedText(docId).then(
      (text) => {
        console.log('>>> text: ', text)
        this.extractedText = text['text']
        this.form = this.createForm()
      }
    )
  }

  // methods
  createForm() : FormGroup {
    return this.fb.group({
      title: this.fb.control('', [ Validators.required ]),
      extractedText: this.fb.control(this.extractedText, [ Validators.required ]),
      questionType: this.fb.control('', [ Validators.required ]),
      difficulty: this.fb.control('', [ Validators.required ]),
      language: this.fb.control('', [ Validators.required ])
    })
  }

  generateQuiz() {
    const info = this.form.value as quizinfo
    console.log('>>> button clicked: ', info)
    this.qSvc.generateQuiz(info).then(
      (quizQuestions: QuestionsMCQArray) => {
        console.log('>>> generated: ', typeof(quizQuestions))
        this.qSvc.updateQuizQuestions(quizQuestions)
        this.router.navigate(['/quiz', '123'])
      }
    )
  }
}
