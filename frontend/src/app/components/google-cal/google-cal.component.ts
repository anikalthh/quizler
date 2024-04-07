import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyHttpService } from '../../services/my-http.service';
import { GcalService } from '../../services/gcal.service';
import { ActivatedRoute } from '@angular/router';
import { StudySession } from '../../models';

@Component({
  selector: 'app-google-cal',
  templateUrl: './google-cal.component.html',
  styleUrl: './google-cal.component.css'
})
export class GoogleCalComponent implements OnInit {

  // dependencies
  private fb = inject(FormBuilder)
  private http = inject(MyHttpService)
  private gCalSvc = inject(GcalService)
  private activatedRoute = inject(ActivatedRoute)

  // vars
  form !: FormGroup
  url = ''
  auth !: string
  storedEventDetails !: StudySession

  // form data
  meetingTitle !: string
  datetime !: string
  duration !: number
  email !: string
  attendee !: string[]


  // lifecycle hooks
  ngOnInit(): void {
    this.http.get("/api/auth/url").subscribe((data: any) => {
      this.url = data.authURL
      console.log('auth url: ', data.authURL)
    });
    this.auth = this.activatedRoute.snapshot.queryParams['auth']


    // check if localstorage has prev form data
    this.storedEventDetails = JSON.parse(window.localStorage.getItem('eventDetails') || '{}') as StudySession

    console.log('local storage: ', JSON.parse(window.localStorage.getItem('eventDetails') || '{}') as StudySession)
    // this.storedEventDetails = window.localStorage.getItem('eventDetails') 
    if (this.auth === 'Success' && this.storedEventDetails !== undefined) {
      console.log('auth success, sending details now')
      this.meetingTitle = this.storedEventDetails['meetingTitle']
      this.datetime = this.storedEventDetails['datetime'] 
      this.duration = this.storedEventDetails['duration']
      this.email = this.storedEventDetails['email'] 
      this.attendee = this.storedEventDetails['attendee'] 
      this.form = this.createForm()
      this.gCalSvc.sendEventDetails(this.storedEventDetails)

    } else {
      this.meetingTitle = ''
      this.datetime = ''
      this.duration = 1 // 1 hour
      this.email = ''
      this.attendee = []
      this.form = this.createForm()
    }
  }

  // methods
  createForm(): FormGroup {
    return this.fb.group({
      meetingTitle: this.fb.control(this.meetingTitle, [Validators.required]),
      datetime: this.fb.control(this.datetime, [Validators.required]),
      duration: this.fb.control(this.duration, [Validators.required, Validators.min(1)]),
      email: this.fb.control(this.email, [Validators.required, Validators.email]),
      attendee: this.fb.control(this.attendee, [Validators.required, Validators.email])
    })
  }

  scheduleStudySession() {
    const eventDetails = this.form.value
    console.log('eventDetails: ', JSON.stringify(eventDetails))
    window.localStorage.setItem('eventDetails', JSON.stringify(eventDetails))
    window.location.href = this.url
  }
}

