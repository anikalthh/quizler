import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { AxiosService } from '../../services/axios.service';
import { QuizService } from '../../services/quiz.service';
import { Router } from '@angular/router';

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
  docs$ = this.quizSvc.getAllDocuments(this.userId)
  topicQuizzes$ = this.quizSvc.getAllTopicGeneratedQuizzes(this.userId)

  // lifecycle hooks
  ngOnInit(): void {

  }

  // methods
  getQuizzes(S3Id: string) {
    this.router.navigate([S3Id, 'quizzes'])
  }

  getAttempts(quizId: string) {
    this.router.navigate([])
  }

}
