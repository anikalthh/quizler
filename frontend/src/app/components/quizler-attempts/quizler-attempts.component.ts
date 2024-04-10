import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { GeneratedQuiz, QuizAttempt } from '../../models';
import { Location } from '@angular/common';

@Component({
  selector: 'app-quizler-attempts',
  templateUrl: './quizler-attempts.component.html',
  styleUrl: './quizler-attempts.component.css'
})

export class QuizlerAttemptsComponent implements OnInit, AfterViewInit {

  // dependencies
  private activatedRoute = inject(ActivatedRoute)
  private quizSvc = inject(QuizService)
  private _location = inject(Location)

  // vars
  quizId !: string
  docId !: string
  quizTitle !: string
  attempts$ !: Promise<QuizAttempt[]>
  attemptsArr !: QuizAttempt[]
  score !: number
  typeBased = this.activatedRoute.snapshot.queryParams['type']
  // TEST VARS FOR CHART
  data: any
  options: any
  chartsReady = false

  // lifecycle hooks
  ngOnInit(): void {
    this.quizId = this.activatedRoute.snapshot.params['quizId']
    this.attempts$ = this.quizSvc.getAllQuizAttempts(this.quizId, this.typeBased)
    this.quizSvc.getGeneratedQuiz(this.quizId, this.typeBased).then(
      (quiz) => {
        this.quizTitle = quiz.quizTitle
        this.docId = quiz.documentId
      }
    )

    // TESTTT CHART
    this.quizSvc.getAllQuizAttempts(this.quizId, this.typeBased).then(
      (attempts) => {
        this.attemptsArr = attempts
        this.chartsReady = true
      }
    )

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.data = {
      labels: ['Correct', 'Wrong'],
      datasets: [
        {
          data: [this.score,],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };


    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };

    console.log('quizattempts missing??: ', this.attemptsArr)
  }

  ngAfterViewInit(): void {
    this.chartsReady = true
  }

  // methods
  backButton() {
    this._location.back()
  }

  getChartData(attemptId: string | null) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    console.log('what colour property is this: ', documentStyle.getPropertyValue('--blue-500'))

    if(this.attemptsArr) {
      const foundAttempt = this.attemptsArr.find((attempt) => attempt.attemptId === attemptId)
      if (foundAttempt) {
        return {
          labels: ['Correct', 'Wrong'],
          datasets: [
            {
              data: [foundAttempt.score, (foundAttempt.answers.length-foundAttempt.score)],
              backgroundColor: ['#30b840', '#de1818'],
              hoverBackgroundColor: ['#27db3c', 'red']
            }
          ]
        }
      } else {
        return null
      }
    }
    return null
    // if (foundAttempt) {
    //   return {
    //     labels: ['Correct', 'Wrong'],
    //     datasets: [
    //       {
    //         data: [foundAttempt.score, (foundAttempt.answers.length-foundAttempt.score)],
    //         backgroundColor: ['#30b840', '#de1818'],
    //         hoverBackgroundColor: ['#27db3c', 'red']
    //       }
    //     ]
    //   }
    // } else {
    //   return null
    // }
  }

}


