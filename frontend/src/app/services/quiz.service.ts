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
  generateQuizContextBased(info: quizinfo) {
    return firstValueFrom(this.http.post<GeneratedQuiz>('/api/generate', info))
  }

  generateQuizTopicBased(info: quizinfo) {
    return firstValueFrom(this.http.post<GeneratedQuiz>('/api/generate/topic', info))
  }

  // Pass data between quizler components via service
  updateQuizQuestions(questions: any) {
    this.generatedQuiz = questions
    console.log('>>> in svc: ', this.generatedQuiz)
  }

  // Get generated quiz
  getGeneratedQuiz(quizId: string, typeBased: string) {
    return firstValueFrom(this.http.get<GeneratedQuiz>(`/api/quiz/${quizId}/${typeBased}`))
  }

  // Delete Quiz
  deleteQuiz(quizId: string) {
    return firstValueFrom(this.http.delete(`/api/quiz/${quizId}`))
  }

  // Post user's answers data to SpringBoot
  submitAnswersSvc(quizAttempt: QuizAttempt, typeBased: string) {
    return firstValueFrom(this.http.post(`/api/submitquiz/${typeBased}`, quizAttempt))
  }

  // Get all documents uploaded by a user
  getAllDocuments(userId: string | null) {
    if (userId === null ) {
      userId = ''
    }
    return firstValueFrom(this.http.get<S3Data[]>(`/api/documents/${userId}`))
  }

  // Get specific document via Document ID
  getDocument(docId: string) {
    return firstValueFrom(this.http.get<S3Data>(`/api/document/${docId}`))
  }

  // Delete documents and all quizzes and attempts under it
  deleteDocument(docId: string) {
    return firstValueFrom(this.http.delete<any>(`/api/document/${docId}`))
  }

  // Get all quizzes generated from a document
  getAllQuizzesByDocId(S3Id: string) : Promise<FullMCQQuizData[]> {
    return firstValueFrom(this.http.get<FullMCQQuizData[]>(`/api/${S3Id}/quizzes`))
  }

  // Get all quizzes generated from a topic
  getAllTopicGeneratedQuizzes(userId: string | null) : Promise<FullMCQQuizData[]> {
    return firstValueFrom(this.http.get<FullMCQQuizData[]>(`/api/topic/quizzes/${userId}`))
  }

  // Get all quiz attempts of a generated quiz
  getAllQuizAttempts(quizId: string, typeBased: string) {
    console.log('exists in svc? : ', quizId)
    return firstValueFrom(this.http.get<QuizAttempt[]>(`/api/${typeBased}/${quizId}/attempts`))
  }

  // Get Quiz Attempt -> To review answers
  getQuizAttempt(attemptId: string) {
    return firstValueFrom(this.http.get<QuizAttempt>(`/api/attempt/${attemptId}`))
  }
}
