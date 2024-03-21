import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Answer, GeneratedQuiz, QuizAttempt, quizinfo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // vars
  generatedQuiz !: GeneratedQuiz

  constructor(private http: HttpClient) { }

  // Post quiz requirements / info data to SpringBoot to call OpExams API
  generateQuiz(info: quizinfo) {
    return firstValueFrom(this.http.post<GeneratedQuiz>('http://localhost:8080/api/generate', info))
  }

  // Pass data between quizler components via service
  updateQuizQuestions(questions: any) {
    this.generatedQuiz = questions
    console.log('>>> in svc: ', this.generatedQuiz)
  }

  // Get generated quiz
  getGeneratedQuiz(quizId: string) {
    return firstValueFrom(this.http.get<GeneratedQuiz>(`http://localhost:8080/api/quiz/${quizId}`))
  }

  // Post user's answers data to SpringBoot
  submitAnswersSvc(quizAttempt: QuizAttempt) {
    return firstValueFrom(this.http.post('http://localhost:8080/api/submitquiz', quizAttempt))
  }
}
