import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AxiosService } from '../../services/axios.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  private router = inject(Router)
  private axiosSvc = inject(AxiosService)

  logout() {
    window.localStorage.removeItem("auth_token");
    this.router.navigate(['/'])
    this.axiosSvc.loggedIn.next(false)
  }
}
