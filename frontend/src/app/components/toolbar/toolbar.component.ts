import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AxiosService } from '../../services/axios.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  // dependencies
  private router = inject(Router)
  private axiosSvc = inject(AxiosService)

  // vars
  items: MenuItem[];

  constructor() {
    this.items = [
      { label: 'Context-Based', icon: 'pi pi-pencil', routerLink: ['/quiz'], queryParams: {type: 'contextBased'} },
      { label: 'Topic-Based', icon: 'pi pi-pencil', routerLink: ['/quiz'], queryParams: {type: 'topicBased'} }
    ]
  }

  logout() {
    window.localStorage.removeItem("auth_token");
    this.router.navigate(['/'])
    this.axiosSvc.loggedIn.next(false)
  }
}
