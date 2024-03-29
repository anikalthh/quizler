import { AfterViewInit, Component } from '@angular/core';
import { AxiosService } from './services/axios.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  constructor(private axiosSvc: AxiosService, private router: Router, private activateRoute: ActivatedRoute) { }

  currRoute !: string | null
  isLoggedIn !: boolean

  ngAfterViewInit(): void {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url) {
        // Only process the code if event.url is not null and has a value
        this.currRoute = event.url;
        console.log('CURR ROUTE:', this.currRoute);
        console.log('init: ', this.axiosSvc.isAuthenticatedUser(), this.currRoute)
        if (this.axiosSvc.isAuthenticatedUser() && (this.currRoute === "/" || this.currRoute === "/login" || this.currRoute === "/signup")) {
          // If user is authenticated, navigate to the dashboard or home page
          this.router.navigate(['/home']);
          this.isLoggedIn = true
        }
      }
    })

    this.axiosSvc.isLoggedIn().subscribe(
      (bool) => {
        this.isLoggedIn = bool
      }
    )
  }
}
