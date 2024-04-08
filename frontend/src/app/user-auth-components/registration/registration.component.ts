import { EventEmitter, Component, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { registration } from '../../models';
import { AxiosService } from '../../services/axios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {

  constructor(private axiosSvc: AxiosService) { }

  // dependencies
  private fb = inject(FormBuilder)
  private router = inject(Router)

  // vars
  registerForm !: FormGroup
  registrationError : boolean = false
  failureMsg = [{ severity: 'error', summary: 'Unable to register', detail: 'Try again with a different username and check that all your fields are valid!' }];

  // event emitters
  // @Output() onSubmitRegisterEvent = new EventEmitter();

  // lifecycle hooks
  ngOnInit(): void {
    this.registerForm = this.createForm()
  }

  // methods
  createForm(): FormGroup {
    return this.fb.group({
      username: this.fb.control('', [Validators.required]),
      firstname: this.fb.control('', [Validators.required]),
      lastname: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.email]),
      password: this.fb.control('', [Validators.required])
    })
  }

  onSubmitRegister() {
    console.log("REGISTRATION EVENT EMITTER: ", this.registerForm.value as registration)
    // this.onSubmitRegisterEvent.emit(this.registerForm.value as registration)

    this.axiosSvc.request(
      "POST",
      "/register",
      this.registerForm.value as registration
    ).then(
      response => {
        this.axiosSvc.setAuthToken(response.data.token);
        this.router.navigate(['/home'])
        this.axiosSvc.loggedIn.next(true)
      }).catch(
        error => {
          this.axiosSvc.setAuthToken(null);
          console.log('register error: ', error)
          this.registrationError= true
        }
      );
  }
}

