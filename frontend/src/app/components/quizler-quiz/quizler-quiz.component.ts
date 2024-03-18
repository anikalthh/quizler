import { Component, OnInit, inject } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { QuestionsMCQ, QuestionsMCQArray } from '../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuizStore } from '../../services/quiz.store';
import { take } from 'rxjs';

@Component({
  selector: 'app-quizler-quiz',
  templateUrl: './quizler-quiz.component.html',
  styleUrl: './quizler-quiz.component.css'
})
export class QuizlerQuizComponent implements OnInit {
  // dependencies
  private qSvc = inject(QuizService)
  private fb = inject(FormBuilder)
  private quizStore = inject(QuizStore)

  // vars
  quiz !: QuestionsMCQArray
  form !: FormGroup
  totalNumOfQns !: number
  qnsAnswered : number = 0

  // HTML vars
  // optionButton = document.getElementsByClassName('optionButton') as HTMLCollectionOf<HTMLElement>;
  // currentQuestion = document.getElementsByClassName('card-wrapper') as HTMLCollectionOf<HTMLElement>;
  btnStyle!: string

  // lifecycle hooks
  ngOnInit(): void {
    this.form = this.createForm()
    this.quiz = this.qSvc.generatedQuiz
    this.totalNumOfQns = this.quiz.data.length
    console.log('CAN SEE QUIZ OR NOTTT: ', typeof (this.qSvc.generatedQuiz))
    this.btnStyle = 'btn-unselected'
  }

  // methods
  createForm(): FormGroup {
    return this.fb.group({
      answer: this.fb.control('', [Validators.required])
    })
  }

  getAlphabeticalOrder(index: number): string {
    // Assuming you want lowercase alphabets starting from 'a'
    return String.fromCharCode(97 + index);
  }

  selectOption(question: QuestionsMCQ, option:string, qnIndex: number, optionIndex: number) {
    // vars
    let answerExists: boolean 
    let buttonOptions = document.getElementsByClassName(`${question.id}`) as HTMLCollectionOf<HTMLElement>
    
    for (let i = 0; i < buttonOptions.length; i++) {
      let element = buttonOptions[i].children[1].children[0] as HTMLElement
      element.style.border="2px solid #9eade6"
    }
    let selectedButton = document.getElementById(`${question.id}-${optionIndex}`) as HTMLElement
    selectedButton.style.border="3px solid white"

    // subscriptions
    this.quizStore.getIndexes.pipe(
      take(1)
    ).subscribe(
      (idxArray) => {
        answerExists = (idxArray.includes(qnIndex))
        console.log('qnIndex: ', qnIndex)
        console.log('INDEX ARRAY: ', idxArray)
        console.log('answer exists or not: ', answerExists)
        if (!answerExists) {
          this.quizStore.addAnswer({
            "index": qnIndex,
            "question": question.question,
            "selectedOption": option,
            "correctAnswer": question.answer,
            "isCorrect": question.answer === option
          })
          console.log('ADD NEWWW')
        } else {
          this.quizStore.updateAnswer({"index": qnIndex, "update": {
            "selectedOption": option,
            "isCorrect": question.answer === option
          }})
          console.log('UPDATEEEE')
        }
      }
    )

    this.quizStore.getNumberOfAnswers.subscribe(
      (num) => {
        this.qnsAnswered = num
      }
    )

    this.quizStore.getAllAnswers.subscribe(
      (value) => {
        console.log('all answers: ', value)
      }
    )
  }
}
