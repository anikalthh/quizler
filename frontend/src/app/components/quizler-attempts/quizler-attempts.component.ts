import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { GeneratedQuiz, QuizAttempt } from '../../models';

@Component({
  selector: 'app-quizler-attempts',
  templateUrl: './quizler-attempts.component.html',
  styleUrl: './quizler-attempts.component.css'
})
export class QuizlerAttemptsComponent implements OnInit{

  // dependencies
  private activatedRoute = inject(ActivatedRoute)
  private quizSvc = inject(QuizService)

  // vars
  quizId !: string
  quizTitle !: string
  attempts$ !: Promise<QuizAttempt[]>
  score !: number

  // lifecycle hooks
  ngOnInit(): void {
    this.quizId = this.activatedRoute.snapshot.params['quizId']
    this.attempts$ = this.quizSvc.getAllQuizAttempts(this.quizId)
    this.quizSvc.getGeneratedQuiz(this.quizId).then(
      (quiz) => {
        this.quizTitle = quiz.quizTitle
      }
    )
  }
}
