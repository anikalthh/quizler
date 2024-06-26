import { Component, OnInit, inject } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { FullMCQQuizData } from '../../models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-quizler-list',
  templateUrl: './quizler-list.component.html',
  styleUrl: './quizler-list.component.css'
})
export class QuizlerListComponent implements OnInit {

  // dependencies
  private quizSvc = inject(QuizService)
  private activatedRoute = inject(ActivatedRoute)
  private messageService = inject(MessageService)

  // vars
  S3Id !: string
  documentTitle !: string
  quizzes$ !: Promise<FullMCQQuizData[]>
  isQuizDeleted: boolean = false
  errorDeletingQuiz: boolean = false
  successMsg = [{ severity: 'success', summary: 'Success', detail: `Quiz successfully deleted!` }];
  failureMsg = [{ severity: 'error', summary: 'Failure', detail: 'Error occurred while deleting your quiz.' }];

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
      (msg) => {
        this.loadQuizzes() // reload after deletion
        console.log('check: ', JSON.parse(JSON.stringify(msg))['quizId'])
        if (JSON.parse(JSON.stringify(msg))['quizId'] === 'error') {
          // this.errorDeletingQuiz = true
          this.messageService.add({ key: 'deleted', severity: 'success', summary: 'Error', detail: 'Unable to delete your quiz. Please try again!' });
        } else {
          // this.isQuizDeleted = true
          this.messageService.add({ key: 'deleted', severity: 'success', summary: 'Success!', detail: 'Your quiz and all of your attempts of it have been deleted.' });
        }
      }
    )
  }

  // viewPreviousAttempts(quizId: string) {
  //   this.quizSvc.getAllQuizAttempts(quizId, 'contextBased')
  // }

}
