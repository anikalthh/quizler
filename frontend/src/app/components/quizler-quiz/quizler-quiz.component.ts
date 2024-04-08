import { Component, OnInit, inject } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Answer, GeneratedQuiz, QuestionsMCQ } from '../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuizStore } from '../../services/quiz.store';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AxiosService } from '../../services/axios.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-quizler-quiz',
  templateUrl: './quizler-quiz.component.html',
  styleUrl: './quizler-quiz.component.css'
})
export class QuizlerQuizComponent implements OnInit {
  // dependencies
  private quizSvc = inject(QuizService)
  // private fb = inject(FormBuilder)
  private quizStore = inject(QuizStore)
  private activatedRouter = inject(ActivatedRoute)
  private axiosSvc = inject(AxiosService)
  private _location = inject(Location)
  private router = inject(Router)

  // vars
  quizId !: string
  quizJson !: GeneratedQuiz
  quiz !: QuestionsMCQ[]
  form !: FormGroup
  totalNumOfQns !: number
  qnsAnswered: number = 0
  allAnswers !: Answer[]
  allAnswered: boolean = false
  submitted: boolean = false
  score: number = 0
  showAnswers: boolean = false
  typeBased = this.activatedRouter.snapshot.queryParams['type']

  // HTML vars
  btnStyle!: string

  // lifecycle hooks
  ngOnInit(): void {
    this.quizId = this.activatedRouter.snapshot.params['quizId']
    // console.log('QUIZ IDDD: ', this.quizId)
    // this.quizJson = this.quizSvc.generatedQuiz
    this.quizSvc.getGeneratedQuiz(this.quizId, this.typeBased).then(
      (generatedQuiz: GeneratedQuiz) => {
        this.quizJson = generatedQuiz
        // console.log("quiz", this.quizJson)
        this.quiz = this.quizJson.data
        this.totalNumOfQns = this.quiz.length
        this.btnStyle = 'btn-unselected'
      }
    )
  }

  // methods

  // Order the answer options under each question
  getAlphabeticalOrder(index: number): string {
    return String.fromCharCode(97 + index);
  }

  selectOption(question: QuestionsMCQ, option: string, qnIndex: number, optionIndex: number) {
    // vars
    let answerExists: boolean
    let buttonOptions = document.getElementsByClassName(`${question.id}`) as HTMLCollectionOf<HTMLElement>

    // Iterate through all the buttons under each question and reset the styling
    for (let i = 0; i < buttonOptions.length; i++) {
      let element = buttonOptions[i].children[1].children[0] as HTMLElement
      element.style.border = "2px solid #9eade6"
    }
    // Change the styling for the selected option
    let selectedButton = document.getElementById(`${question.id}-${optionIndex}`) as HTMLElement
    selectedButton.style.border = "3px solid white"

    // subscriptions
    this.quizStore.getIndexes.pipe(
      take(1)
    ).subscribe(
      (idxArray) => {
        answerExists = (idxArray.includes(qnIndex))
        // console.log('qnIndex: ', qnIndex)
        // console.log('INDEX ARRAY: ', idxArray)
        // console.log('answer exists or not: ', answerExists)
        if (!answerExists) {
          this.quizStore.addAnswer({
            "index": qnIndex,
            "question": question.question,
            "selectedOption": option,
            "correctAnswer": question.answer,
            "isCorrect": question.answer === option
          })
        } else {
          this.quizStore.updateAnswer({
            "index": qnIndex, "update": {
              "selectedOption": option,
              "isCorrect": question.answer === option
            }
          })
        }
      }
    )

    this.quizStore.getNumberOfAnswers.subscribe(
      (num) => {
        this.qnsAnswered = num
        if (this.qnsAnswered === this.totalNumOfQns) {
          this.allAnswered = true
        }
      }
    )

    this.quizStore.getAllAnswers.subscribe(
      (value) => {
        this.allAnswers = value
      }
    )
  }

  submitAnswers() {
    this.allAnswers.sort((a, b) => a.index - b.index);
    this.allAnswers.map(answer => {
      if (answer.isCorrect) {
        this.score += 1
      }
    })
    const quizAttempt = {
      userId: this.axiosSvc.getUserId(),
      attemptId: null,
      documentId: this.quizJson.documentId,
      quizId: this.quizJson.quizId,
      datetime: Date.now(),
      score: this.score,
      answers: this.allAnswers
    }
    // console.log('DATETIME FORMAT: ', Date.now())
    this.quizSvc.submitAnswersSvc(quizAttempt, this.typeBased).then(
      (quizAttemptId) => {
        this.submitted = true
      }
    )
    
  }

  retryQuiz() {
    // this.submitted = false
    // console.log('getting store b4: ', this.quizStore.getAllAnswers)

    this.quizStore.clearStore()
    // console.log('getting store after: ', this.quizStore.getAllAnswers)
    window.location.reload();
  }

  showAnswersBtn() {
    this.showAnswers = true
  }

  backButton() {
    // console.log('getting store b4: ', this.quizStore.getAllAnswers)

    this.quizStore.clearStore()
    // console.log('getting store after: ', this.quizStore.getAllAnswers)
    this._location.back()
  }

  viewAllAttempts() {
    console.log('getting store b4 view attempts btn: ', this.quizStore.getAllAnswers)

    this.quizStore.clearStore()
    console.log('getting store after view attempts btn: ', this.quizStore.getAllAnswers)
    this.router.navigate(['/quiz', this.quizId, 'attempts'])
  }
}
