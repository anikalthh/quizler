import { Component, OnInit, ViewChild, inject } from '@angular/core';
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
          console.log('quizzes: ', val)
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
      (val) => {
        console.log('delete count: ', val)
        this.loadDocs() // reload after deletion
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
