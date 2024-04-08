import { Component, OnInit, inject } from '@angular/core';
import { AxiosService } from '../../services/axios.service';
import { QuizService } from '../../services/quiz.service';
import { Router } from '@angular/router';
import { FullMCQQuizData, S3Data } from '../../models';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {

  // dependencies
  private axiosSvc = inject(AxiosService)
  private quizSvc = inject(QuizService)
  private router = inject(Router)

  // vars
  userId = this.axiosSvc.getUserId()
  dayOfTheWeek : Date = new Date()
  username = this.axiosSvc.getUsername()
  docs$ !: Promise<S3Data[]>
  topicQuizzes$ !: Promise<FullMCQQuizData[]>
  isDocDeleted : boolean = false
  errorDeletingDoc : boolean = false
  successMsg = [{ severity: 'success', summary: 'Success', detail: `Document successfully deleted!` }];
  failureMsg = [{ severity: 'error', summary: 'Failure', detail: 'Error occurred while deleting your document.' }];


  // lifecycle hooks
  ngOnInit(): void {
    this.loadTopicQuizzes()
    this.loadDocs()
  }

  // methods
  getQuizzes(S3Id: string) {
    this.router.navigate([S3Id, 'quizzes'])
  }

  loadTopicQuizzes() {
    this.topicQuizzes$ = this.quizSvc.getAllTopicGeneratedQuizzes(this.userId).then(
      (val) => {
        if (val) {
          return val
        } else {
          return []
        }
      }
    )
  }

  loadDocs() {
    this.docs$ = this.quizSvc.getAllDocuments(this.userId).then(
      (val) => {
        if (val) {
          return val
        } else {
          return []
        }
      }
    )
  }

  getAttempts(quizId: string) {
    this.router.navigate([])
  }

  deleteDocument(S3Id: string) {
    this.quizSvc.deleteDocument(S3Id).then(
      (msg) => {
        console.log('delete count: ', msg)
        this.loadDocs() // reload after deletion
        if (JSON.parse(JSON.stringify(msg))['docId'] === 'error') {
          this.errorDeletingDoc = true
        } else {
          this.isDocDeleted = true
        }
      }
    )
  }

  deleteQuiz(quizId: string) {
    this.quizSvc.deleteQuiz(quizId).then(
      (val) => {
        console.log('delete count: ', val)
        this.loadTopicQuizzes() // reload after deletion
      }
    )
  }
}
