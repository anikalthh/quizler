export interface quizinfo {
    title: string
    extractedText: string
    questionType: string
    language: string
    difficulty: string
}

export interface QuestionsMCQ {
    id: string
    question: string
    answer: string
    options: string[]
}

export interface QuestionsMCQArray {
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
