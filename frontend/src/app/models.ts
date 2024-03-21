export interface quizinfo {
    title: string
    extractedText: string
    documentId: string
    type: string
    questionType: string
    language: string
    difficulty: string
}

export interface GeneratedQuiz {
    documentId: string
    quizId: string
    data: QuestionsMCQ[]
}

export interface QuestionsMCQ {
    id: string
    question: string
    answer: string
    options: string[]
}

export interface QuizAttempt {
    documentId: string
    quizId: string
    answers: Answer[]
}

// COMPONENT STORE
export interface Answer {
    index: number
    question: string
    selectedOption: string
    correctAnswer: string
    isCorrect: boolean
}
export interface AnswersSlice {
    answers: Answer[]
}
