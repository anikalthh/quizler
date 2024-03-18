import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  // dependencies
  private fb = inject(FormBuilder)

  // vars
  form !: FormGroup

  // lifecycle hooks
  ngOnInit(): void {
    this.form = this.createForm()
  }

  // methods
  createForm() : FormGroup {
    return this.fb.group({
      username: this.fb.control('', [ Validators.required, Validators.minLength(5) ]),
      email: this.fb.control('', [ Validators.required, Validators.email ]),
      password: this.fb.control('', [ Validators.required ]),
      confirmPassword: this.fb.control('', [ Validators.required ])
    })
  }
}
