import { Component, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitter } from 'stream';
import { registration } from '../../models';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {
  // dependencies
  private fb = inject(FormBuilder)

  // vars
  registerForm !: FormGroup
  
  // event emitters
  @Output() onSubmitRegisterEvent = new EventEmitter();

  // lifecycle hooks
  ngOnInit(): void {
    this.registerForm = this.createForm()
  }

  // methods
  createForm() : FormGroup {
    return this.fb.group({
      username: this.fb.control('', [Validators.required]),
      firstname: this.fb.control('', [Validators.required]),
      lastname: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.email]),
      password: this.fb.control('', [Validators.required])
    })
  }

  onSubmitRegister() {
    this.onSubmitRegisterEvent.emit(this.registerForm.value as registration)
  }
}
