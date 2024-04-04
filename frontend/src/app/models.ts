export interface quizinfo {
    userId: string
    quizTitle: string
    extractedText: string
    documentId: string
    type: string
    questionType: string
    language: string
    difficulty: string
    data: QuestionsMCQ[]
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
    userId: string | null
    documentId: string
    quizId: string
    answers: Answer[]
}

export interface S3Data {
    userId: string
    title: string
    S3Id: string
}

export interface FullMCQQuizData {
    userId: string
    quizId: string
    documentId: string
    extractedText: string
    difficulty: string
    type: string
    questionType: string
    language: string
    data: QuestionsMCQ[]
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

// USER AUTHENTICATION VIA JWT
export interface registration {
    username: string
    firstname: string
    lastname: string
    email: string
    password: string
}

export interface login {
    username: string
    password: string
}
