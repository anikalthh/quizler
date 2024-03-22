import { Component, OnInit, inject } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { S3Data } from '../../models';

@Component({
  selector: 'app-quizler-docs',
  templateUrl: './quizler-docs.component.html',
  styleUrl: './quizler-docs.component.css'
})
export class QuizlerDocsComponent implements OnInit {
  // dependencies
  private quizSvc = inject(QuizService)

  // vars
  allDocuments$!: S3Data[]
  userId!: string

  // lifecycle hooks
  ngOnInit(): void {
    this.userId = '123'
    this.quizSvc.getAllDocuments(this.userId).then(
      (S3Data) => {
        this.allDocuments$ = S3Data
        console.log('>>> DOCUMENTS: ', this.allDocuments$)
      }
    )
  }
}
