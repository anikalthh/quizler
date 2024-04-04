import { Component, ViewChild, inject } from '@angular/core';
import { AxiosService } from '../../services/axios.service';
import { QuizService } from '../../services/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  // dependencies
  private axiosSvc = inject(AxiosService)
  private quizSvc = inject(QuizService)
  private router = inject(Router)

  // vars
  userId = this.axiosSvc.getUserId()
  dayOfTheWeek : Date = new Date()
  username = this.axiosSvc.getUsername()
  docs$ = this.quizSvc.getAllDocuments(this.userId)

  // methods
  getQuizzes(S3Id: string) {
    this.router.navigate([S3Id, 'quizzes'])
  }

}
