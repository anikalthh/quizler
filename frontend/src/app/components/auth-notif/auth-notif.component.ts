import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { GcalService } from '../../services/gcal.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth-notif',
  templateUrl: './auth-notif.component.html',
  styleUrl: './auth-notif.component.css'
})
export class AuthNotifComponent implements OnInit, AfterViewInit {

  private gCalSvc = inject(GcalService)
  private activatedRoute = inject(ActivatedRoute)
  private messageService = inject(MessageService)

  // vars 
  auth !: string
  isAuthenticated !: boolean

  ngOnInit(): void {
    this.auth = this.activatedRoute.snapshot.queryParams['auth']
    
  }

  ngAfterViewInit(): void {
    if (this.auth === 'Success') {
      this.isAuthenticated = true
      this.messageService.add({ key: 'googlecal', severity: 'success', summary: 'Success!', detail: `Your Google account has been authenticated! You may close this tab.`, sticky: true, closable: false });


    } else if (this.auth === 'Failure') {
      this.isAuthenticated = false
      this.messageService.add({ key: 'googlecal', severity: 'error', summary: 'Error', detail: `Unable to authenticate your Google account. Please try again!`, sticky: true, closable: false });

    }
  }
}

// if (!this.isGoogleAuthSuccessful && this.triedAuth) {
//   this.messageService.add({ key: 'googlecal', severity: 'error', summary: 'Error', detail: `Unable to authenticate your Google account, study session <${this.meetingTitle}> has not been scheduled. Please try again!`, sticky: true });
// } else if (this.isGoogleAuthSuccessful) {
//   this.messageService.add({ key: 'googlecal', severity: 'success', summary: 'Success!', detail: `Your Google account has been authenticated and your study session <${this.meetingTitle}> has been created!`, sticky: true });
// }