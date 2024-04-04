import { Component, OnInit, inject } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { FullMCQQuizData } from '../../models';

@Component({
  selector: 'app-quizler-list',
  templateUrl: './quizler-list.component.html',
  styleUrl: './quizler-list.component.css'
})
export class QuizlerListComponent implements OnInit {

  // dependencies
  private quizSvc = inject(QuizService)
  private activatedRoute = inject(ActivatedRoute)

  // vars
  S3Id !: string
  quizzes$ !: Promise<FullMCQQuizData[]>

  // lifecycle hooks
  ngOnInit(): void {
    this.S3Id = this.activatedRoute.snapshot.params['docId']
    console.log('route: ', this.S3Id)
    this.loadQuizzes()
  }

  // methods
  loadQuizzes() {
    this.quizzes$ = this.quizSvc.getAllQuizzes(this.S3Id).then(
      (val) => {
        if (val) {
          return val
        } else {
          return []
        }
      }
    )
  }

  deleteQuiz(quizId: string) {
    this.quizSvc.deleteQuiz(quizId).then(
      (val) => {
        console.log('delete count: ', val)
        this.loadQuizzes()
      }
    )
  }

}
