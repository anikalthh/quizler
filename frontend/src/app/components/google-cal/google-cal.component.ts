import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyHttpService } from '../../services/my-http.service';
import { GcalService } from '../../services/gcal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudySession } from '../../models';
import { formatDate } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

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
  private router = inject(Router)
  private messageService = inject(MessageService)

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
  isGoogleAuthSuccessful: string = 'undefined'
  triedAuth: boolean = false

  // lifecycle hooks
  ngOnInit(): void {
    this.form = this.createForm()
    this.http.get("/api/auth/url").subscribe((data: any) => {
      console.log('going to 8080 authentication', data.authURL)
      this.url = data.authURL
    });

    // check if localstorage has prev form data
    this.storedEventDetails = JSON.parse(window.localStorage.getItem('eventDetails') || '{}') as StudySession

    // this.storedEventDetails = window.localStorage.getItem('eventDetails') 
    // if (this.auth === 'Success' && this.storedEventDetails !== undefined) {
    //   console.log('auth success, sending details now')
    //   this.meetingTitle = this.storedEventDetails['meetingTitle']
    //   this.startDatetime = this.storedEventDetails['startDatetime']
    //   console.log('datetime format?: ', this.storedEventDetails['startDatetime'])
    //   this.endDatetime = this.storedEventDetails['endDatetime']
    //   this.duration = this.storedEventDetails['duration']
    //   this.email = this.storedEventDetails['email']
    //   this.attendee = this.storedEventDetails['attendee']
    //   this.form = this.createForm()
    //   this.gCalSvc.sendEventDetails(this.storedEventDetails)
    //   // this.isGoogleAuthSuccessful = true


    //   console.log('does it reach here')
    //   // reset form
    //   this.form.reset()

    // } else {
    //   // this.isGoogleAuthSuccessful = false

    //   this.meetingTitle = ''
    //   this.startDatetime = ''
    //   this.endDatetime = ''
    //   this.email = ''
    //   this.attendee = []
    //   this.form = this.createForm()
    // }
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
    window.open(this.url, "_blank");
    // window.location.href = this.url

    const interval = setInterval(() => {
      let status = this.getAuthStatus()
      console.log('getting statuss: ', status)
      if (status === 'Success') {
        console.log('getting statuss inside if else block: ', status)
        this.triedAuth = true

        this.gCalSvc.sendEventDetails(this.form.value).then(() => {
          this.messageService.add({ key: 'googlecal', severity: 'success', summary: 'Success!', detail: `Your study session <${this.form.value['meetingTitle']}> has been created and e-invites have been sent to all attendees!`, sticky: true });
          }
        )
        clearInterval(interval); // Stop the interval if the method returns true
        // this.router.navigate(['/calendar'], { queryParams: { auth: 'Success' } })
      } else if (status === 'undefined') {
        // do nothing
      } else {
        this.triedAuth = true
        console.log('getting statuss inside if else block: ', status)
        this.messageService.add({ key: 'googlecal', severity: 'error', summary: 'Error', detail: `Unable to authenticate your Google account, study session <${this.form.value['meetingTitle']}> has not been scheduled. Please try again!`, sticky: true });

        clearInterval(interval); 
      }
    }, 500);
  }

  dateValidation() {
    formatDate(this.startDatetime, this.datetimeFormat, this.locale);
  }

  formatMinDate(): Date {
    // console.log('date check: ', new Date(this.startDatetime))
    return new Date(this.startDatetime);
  }

  currentDate(): Date {
    return new Date();
  }

  setStartDate() {
    this.startDatetime = this.form.value['startDatetime']
  }

  routeBack() {
    this.triedAuth = false
    this.router.navigate(['/calendar'])
    this.form.reset()
  }

  getAuthStatus() {
    this.gCalSvc.getAuthenticationStatus().then(
      (bool) => {
        const auth = JSON.parse(JSON.stringify(bool))
        console.log('BOOL ', auth['status'])
        this.isGoogleAuthSuccessful = auth['status']
      }
    ).catch(
      (bool) => {
        console.log('failure bool: ', bool)

        const auth = JSON.parse(JSON.stringify(bool))
        this.isGoogleAuthSuccessful = auth['status']
        console.log('google auth set to failure: ', auth['status'])
      }
    )
    console.log('is 400 datatype same? : ', typeof(this.isGoogleAuthSuccessful))
    return this.isGoogleAuthSuccessful
  }
}

