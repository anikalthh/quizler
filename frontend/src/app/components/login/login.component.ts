import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  // dependencies
  private fb = inject(FormBuilder)

  // vars
  form !: FormGroup

  // lifecycle hooks
  ngOnInit(): void {
    this.form
  }

  // methods
  createForm() : FormGroup {
    return this.fb.group({
      username: this.fb.control('', [ Validators.required ]),
      password: this.fb.control('', [ Validators.required ])
    })
  }
}
