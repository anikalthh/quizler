import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { login } from '../../models';
import { AxiosService } from '../../services/axios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  constructor(private axiosSvc: AxiosService) {}

  // dependencies
  private fb = inject(FormBuilder)
  private router = inject(Router)

  // vars
  loginForm !: FormGroup
  value: string | undefined;

  // events
  @Output() onSubmitLoginEvent = new EventEmitter()

  // lifecycle hooks
  ngOnInit(): void {
    this.loginForm = this.createForm()
  }

  // methods
  createForm() : FormGroup {
    return this.fb.group({
      username: this.fb.control('', [ Validators.required ]),
      password: this.fb.control('', [ Validators.required ])
    })
  }

  onSubmitLogin() {
    console.log("LOGIN EVENT EMITTER: ", this.loginForm.value as login)
    // this.onSubmitLoginEvent.emit(this.loginForm.value as login)

    this.axiosSvc.request(
      "POST",
      "/login",
      this.loginForm.value as login
	  ).then(
		    response => {
            console.log('LOGIN RESPONSE FRM BACKEND: ', response)
		        this.axiosSvc.setAuthToken(response.data.token);
            this.axiosSvc.loggedIn.next(true)
            this.router.navigate(['/home'])
		    }).catch(
		    error => {
		        this.axiosSvc.setAuthToken(null);
		    }
		)
  }
}
