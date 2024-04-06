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
  documentTitle !: string
  quizzes$ !: Promise<FullMCQQuizData[]>

  // lifecycle hooks
  ngOnInit(): void {
    this.S3Id = this.activatedRoute.snapshot.params['docId']
    console.log('route: ', this.S3Id)
    this.loadQuizzes()
    this.getDocumentTitle(this.S3Id)
  }

  // methods
  loadQuizzes() {
    this.quizzes$ = this.quizSvc.getAllQuizzesByDocId(this.S3Id).then(
      (val) => {
        if (val) {
          console.log('quizzes: ', val)
          return val
        } else {
          return []
        }
      }
    )
  }

  getDocumentTitle(docId: string) {
    this.quizSvc.getDocument(docId).then(
      (val) => {
        this.documentTitle = val.title
      }
    )
  }

  deleteQuiz(quizId: string) {
    this.quizSvc.deleteQuiz(quizId).then(
      (val) => {
        console.log('delete count: ', val)
        this.loadQuizzes() // reload after deletion
      }
    )
  }

  // viewPreviousAttempts(quizId: string) {
  //   this.quizSvc.getAllQuizAttempts(quizId, 'contextBased')
  // }

}
