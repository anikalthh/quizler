import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from '../../services/file-upload.service';
import { Router } from '@angular/router';

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

  // vars
  form !: FormGroup

  // lifecycle hooks
  ngOnInit(): void {
    this.form = this.createForm()
  }

  // methods
  createForm(): FormGroup {
    return this.fb.group({
      title: this.fb.control('', [Validators.required])
    })
  }

  uploadFile(event: any) {
    console.log('>>> upload button clicked')
    const formData = new FormData();
    for (let file of event.files) {
      this.form.patchValue({ docFile: file });

      formData.set('title', this.form.get('title')?.value)
      formData.set('file', file)
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
