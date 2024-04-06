import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { GeneratedQuiz, QuizAttempt } from '../../models';
import { Location } from '@angular/common';

@Component({
  selector: 'app-quizler-attempts',
  templateUrl: './quizler-attempts.component.html',
  styleUrl: './quizler-attempts.component.css'
})
export class QuizlerAttemptsComponent implements OnInit{

  // dependencies
  private activatedRoute = inject(ActivatedRoute)
  private quizSvc = inject(QuizService)
  private _location = inject(Location)

  // vars
  quizId !: string
  docId !: string
  quizTitle !: string
  attempts$ !: Promise<QuizAttempt[]>
  score !: number
  typeBased = this.activatedRoute.snapshot.queryParams['type']

  // lifecycle hooks
  ngOnInit(): void {
    this.quizId = this.activatedRoute.snapshot.params['quizId']
    this.attempts$ = this.quizSvc.getAllQuizAttempts(this.quizId, this.typeBased)
    this.quizSvc.getGeneratedQuiz(this.quizId, this.typeBased).then(
      (quiz) => {
        this.quizTitle = quiz.quizTitle
        this.docId = quiz.documentId
      }
    )
  }

  // methods
  backButton() {
    this._location.back()
  }
}
