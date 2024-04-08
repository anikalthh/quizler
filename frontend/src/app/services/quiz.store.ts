import { Injectable } from "@angular/core";
import { ComponentStore, OnStoreInit } from "@ngrx/component-store";
import { Answer, AnswersSlice } from "../models";
import { Observable, tap } from "rxjs";

const INIT_STORE: AnswersSlice = {
    answers: []
}

@Injectable({
    providedIn: 'root'
})
export class QuizStore extends ComponentStore<AnswersSlice> implements OnStoreInit {
    constructor() {
        super(INIT_STORE)
    }

    // vars
    partialAnswer: Partial<Answer> = {selectedOption: "", isCorrect: false}

    ngrxOnStoreInit(): void {

    }

    // methods
    readonly addAnswer = this.updater<Answer>(
        (slice: AnswersSlice, answer: Answer) => {
            return {
                answers: [...slice.answers, answer]
            }
        }
    )

    readonly getAllAnswers = this.select<Answer[]>(
        (slice: AnswersSlice) => {
            return slice.answers
        }
    )

    readonly getNumberOfAnswers = this.select<number>(
        (slice: AnswersSlice) => slice.answers.length
    )

    readonly getIndexes = this.select<number[]>(
        (slice: AnswersSlice) => {
            return slice.answers.map(answer => answer.index)
        }
    )

    readonly updateAnswer = this.updater((state: AnswersSlice, { index, update }: { index: number, update: Partial<Answer> }) => {
        const updatedAnswers = state.answers.map(answer => {
            // console.log('INDEX ARRAY EXPECTED: ', state.answers.map(answer => answer.index))
            // console.log('ANSWER.INDEX: ', answer.index)

            // if (state.answers.map(answer => answer.index).includes(index)) {
            //     return { ...answer, ...update };
            // }

            if (answer.index === index) {
                return { ...answer, ...update };
            }
            
            return answer;
        });
        return { ...state, answers: updatedAnswers };
    });

    readonly clearStore = this.updater(
        () => INIT_STORE
    );
}