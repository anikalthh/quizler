import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Answer, FullMCQQuizData, GeneratedQuiz, QuizAttempt, S3Data, quizinfo } from '../models';

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

  // Delete Quiz
  deleteQuiz(quizId: string) {
    return firstValueFrom(this.http.delete(`http://localhost:8080/api/quiz/${quizId}`))
  }

  // Post user's answers data to SpringBoot
  submitAnswersSvc(quizAttempt: QuizAttempt) {
    return firstValueFrom(this.http.post('http://localhost:8080/api/submitquiz', quizAttempt))
  }

  // Get all documents uploaded by a user
  getAllDocuments(userId: string | null) {
    if (userId === null ) {
      userId = ''
    }
    return firstValueFrom(this.http.get<S3Data[]>(`http://localhost:8080/api/documents/${userId}`))
  }

  // Get all quizzes generated from a document
  getAllQuizzes(S3Id: string) : Promise<FullMCQQuizData[]> {
    return firstValueFrom(this.http.get<FullMCQQuizData[]>(`http://localhost:8080/api/${S3Id}/quizzes`))
  }
}
