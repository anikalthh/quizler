import { Component, OnInit, inject } from '@angular/core';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-quizler-docs',
  templateUrl: './quizler-docs.component.html',
  styleUrl: './quizler-docs.component.css'
})
export class QuizlerDocsComponent implements OnInit {
  // dependencies
  private quizSvc = inject(QuizService)

  // vars

  // lifecycle hooks
  ngOnInit(): void {
    
  }
}
