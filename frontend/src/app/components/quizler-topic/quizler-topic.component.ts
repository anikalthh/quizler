import { Component, inject } from '@angular/core';
import { GeneratedQuiz, quizinfo } from '../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from '../../services/file-upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { AxiosService } from '../../services/axios.service';

@Component({
  selector: 'app-quizler-topic',
  templateUrl: './quizler-topic.component.html',
  styleUrl: './quizler-topic.component.css'
})
export class QuizlerTopicComponent {
  // dependencies
  private fSvc = inject(FileUploadService)
  private activateRoute = inject(ActivatedRoute)
  private fb = inject(FormBuilder)
  private qSvc = inject(QuizService)
  private router = inject(Router)
  private axiosSvc = inject(AxiosService)

  // vars
  form !: FormGroup
  extractedText!: string
  difficulty!: string
  topic : string = this.activateRoute.snapshot.queryParams['topic']
  typeBased = this.activateRoute.snapshot.queryParams['type']

  // Option Vars
  difficultyOptions: any[] = [
    { name: 'Easy', value: 'easy' },
    { name: 'Medium', value: 'medium' },
    { name: 'Hard', value: 'hard' }
  ]

  languageOptions: any[] = [
    { name: 'English', value: 'English' },
    { name: 'Auto-detect', value: 'Auto' }
  ]

  qnTypeOptions: any[] = [
    { name: 'Multiple Choice Questions', value: 'MCQ' },
    { name: 'True/False', value: 'TF' },
    { name: 'Open-ended', value: 'open' }
  ]

  // lifecycle hooks
  ngOnInit(): void {
    this.form = this.createForm()
  }

  // methods
  createForm(): FormGroup {
    return this.fb.group({
      quizTitle: this.fb.control('', [Validators.required]),
      topic: this.fb.control(this.topic, [Validators.required]),
      questionType: this.fb.control('', [Validators.required]),
      difficulty: this.fb.control('', [Validators.required]),
      language: this.fb.control('', [Validators.required]),
      type: this.fb.control('topicBased'),
      userId: this.fb.control(this.axiosSvc.getUserId())
    })
  }

  generateQuiz() {
    const info = this.form.value as quizinfo
    console.log('>>> button clicked: ', info)
    this.qSvc.generateQuizTopicBased(info).then(
      (quizQuestions: GeneratedQuiz) => {
        console.log('>>> generated: ', quizQuestions)
        this.qSvc.updateQuizQuestions(quizQuestions)
        this.router.navigate(['/quiz', `${quizQuestions.quizId}`])
      }
    )

  }
}
