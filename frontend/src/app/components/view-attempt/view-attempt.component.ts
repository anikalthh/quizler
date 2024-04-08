import { Component, OnInit, inject } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { QuizStore } from '../../services/quiz.store';
import { ActivatedRoute } from '@angular/router';
import { AxiosService } from '../../services/axios.service';
import { Location } from '@angular/common';
import { Answer, QuestionsMCQ, QuizAttempt } from '../../models';

@Component({
  selector: 'app-view-attempt',
  templateUrl: './view-attempt.component.html',
  styleUrl: './view-attempt.component.css'
})
export class ViewAttemptComponent implements OnInit {

  // dependencies
  private quizSvc = inject(QuizService)
  private quizStore = inject(QuizStore)
  private activatedRouter = inject(ActivatedRoute)
  private axiosSvc = inject(AxiosService)
  private _location = inject(Location)

  // vars
  attemptId !: string
  quizId !: string
  totalNumOfQns !: number
  score: number = 0
  allAnswers !: Answer[]
  quiz !: QuestionsMCQ[]
  quizAttempt !: QuizAttempt

    // lifecycle hooks
    ngOnInit(): void {
      this.attemptId = this.activatedRouter.snapshot.params['attemptId']
      console.log('ATTEMPT IDDD: ', this.attemptId)
      // this.quizJson = this.quizSvc.generatedQuiz
      this.quizSvc.getQuizAttempt(this.attemptId).then(
        (attempt) => {
          console.log('am i gettin data: ', attempt)
          this.quizId = attempt.quizId
          this.quizAttempt = attempt
        }
      )
      console.log('quiz attempt promise: ', this.quizAttempt)
    }

  // methods

  // Order the answer options under each question
  getAlphabeticalOrder(index: number): string {
    return String.fromCharCode(97 + index);
  }

}
