import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyHttpService } from '../../services/my-http.service';
import { GcalService } from '../../services/gcal.service';
import { ActivatedRoute } from '@angular/router';
import { StudySession } from '../../models';
import { formatDate } from '@angular/common';

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
  startDatetime !: string
  endDatetime !: string
  datetimeFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
  locale = 'SGT'
  duration !: number
  email !: string
  attendee !: string[]
  isGoogleAuthSuccessful: boolean = false
  triedAuth: boolean = false
  successMsg = [{ severity: 'success', summary: 'Success', detail: 'Successfully created Google Calendar event!' },
  { severity: 'success', summary: 'Success', detail: 'Successfully emailed all attendees!' }];
  failureMsg = [{ severity: 'error', summary: 'Failure', detail: 'Error occurred while inserting session to your Google Calendar.' }];


  // lifecycle hooks
  ngOnInit(): void {
    this.http.get("/api/auth/url").subscribe((data: any) => {
      this.url = data.authURL
    });
    this.auth = this.activatedRoute.snapshot.queryParams['auth']

    if (this.auth !== undefined) {
      this.triedAuth = true
    } else {
      this.triedAuth = false
    }

    // check if localstorage has prev form data
    this.storedEventDetails = JSON.parse(window.localStorage.getItem('eventDetails') || '{}') as StudySession

    // this.storedEventDetails = window.localStorage.getItem('eventDetails') 
    if (this.auth === 'Success' && this.storedEventDetails !== undefined) {
      console.log('auth success, sending details now')
      this.meetingTitle = this.storedEventDetails['meetingTitle']
      this.startDatetime = this.storedEventDetails['startDatetime']
      console.log('datetime format?: ', this.storedEventDetails['startDatetime'])
      this.endDatetime = this.storedEventDetails['endDatetime']
      this.duration = this.storedEventDetails['duration']
      this.email = this.storedEventDetails['email']
      this.attendee = this.storedEventDetails['attendee']
      this.form = this.createForm()
      this.gCalSvc.sendEventDetails(this.storedEventDetails)
      this.isGoogleAuthSuccessful = true

      // reset form
      this.form.reset()

    } else {
      this.isGoogleAuthSuccessful = false
      this.meetingTitle = ''
      this.startDatetime = ''
      this.endDatetime = ''
      this.email = ''
      this.attendee = []
      this.form = this.createForm()
    }
  }

  // methods
  createForm(): FormGroup {
    return this.fb.group({
      meetingTitle: this.fb.control(this.meetingTitle, [Validators.required]),
      startDatetime: this.fb.control(this.startDatetime, [Validators.required]),
      endDatetime: this.fb.control(this.startDatetime, [Validators.required]),
      email: this.fb.control(this.email, [Validators.required, Validators.email]),
      attendee: this.fb.control(this.attendee, [Validators.required])
    })
  }

  scheduleStudySession() {
    const eventDetails = this.form.value
    window.localStorage.setItem('eventDetails', JSON.stringify(eventDetails))
    window.location.href = this.url
  }

  dateValidation() {
    formatDate(this.startDatetime, this.datetimeFormat, this.locale);
  }

  formatMinDate() : Date {
    console.log('date check: ', new Date(this.startDatetime))
    return new Date(this.startDatetime);
  }

  currentDate() : Date {
    return new Date();
  }

  setStartDate() {
    this.startDatetime = this.form.value['startDatetime']
  }
}

