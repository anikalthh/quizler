import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from '../../services/file-upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AxiosService } from '../../services/axios.service';

@Component({
  selector: 'app-quizler',
  templateUrl: './quizler.component.html',
  styleUrl: './quizler.component.css'
})
export class QuizlerComponent implements OnInit {
  @ViewChild('file')
  docFile !: ElementRef

  // dependencies
  private fb = inject(FormBuilder)
  private uploadSvc = inject(FileUploadService)
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)
  private axiosSvc = inject(AxiosService)

  // vars
  form !: FormGroup
  baseType !: string
  isTopicBased !: boolean

  // lifecycle hooks
  ngOnInit(): void {
    // check query params: topic-based or content-based
    this.activatedRoute.queryParams.subscribe(
      (params) => {
        this.baseType = params['type']
        console.log('params changed: ', this.baseType)
        if (this.baseType === 'topicBased') {
          this.form = this.createFormTopicBased()
          this.isTopicBased = true
        } else if (this.baseType === 'contextBased') {
          this.form = this.createFormContentBased()
          this.isTopicBased = false
        }
      }
    )
  }

  // methods
  createFormContentBased(): FormGroup {
    return this.fb.group({
      title: this.fb.control('', [Validators.required])
    })
  }

  createFormTopicBased(): FormGroup {
    return this.fb.group({
      topic: this.fb.control('', [Validators.required])
    })
  }

  generateTopicBasedQuiz() {
    console.log('>>> TOPIC BASED next btn clicked', this.form.value['topic'])
    this.router.navigate(['/generate'], { queryParams: { topic: this.form.value['topic'] }})
  }

  uploadFile(event: any) {
    console.log('>>> upload button clicked')
    const formData = new FormData();
    for (let file of event.files) {
      this.form.patchValue({ docFile: file });

      formData.set('title', this.form.get('title')?.value)
      formData.set('file', file)
      formData.set('userId', this.axiosSvc.getUserId() as unknown as string)

    }

    // service method HTTP POST
    let docId = ''
    this.uploadSvc.uploadDocument(formData).then(
      (value) => {
        // Get documentId from SpringBoot
        docId = value['docId']
        console.log('>>> docId: ', docId)
        this.router.navigate(['/generate', docId]);
      }
    )
  }
}
