import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuestionsMCQArray, quizinfo } from '../models';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // vars
  generatedQuiz !: QuestionsMCQArray

  constructor(private http: HttpClient) { }

  generateQuiz(info: quizinfo) {
    return firstValueFrom(this.http.post<QuestionsMCQArray>('http://localhost:8080/api/generate', info))
  }

  updateQuizQuestions(questions: any) {
    this.generatedQuiz = questions
    console.log('>>> in svc: ', this.generatedQuiz)
  }
}
