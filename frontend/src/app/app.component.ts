import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AxiosService } from './services/axios.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private axiosSvc: AxiosService, private router: Router, private activateRoute: ActivatedRoute) { }

  currRoute !: string | null
  isLoggedIn !: boolean

  ngOnInit(): void {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url) {
        // Only process the code if event.url is not null and has a value
        this.currRoute = event.url;
        console.log('CURR ROUTE:', this.currRoute);
        // console.log('init: ', this.axiosSvc.isAuthenticatedUser(), this.currRoute)
        console.log('is user logged in check: ', this.isLoggedIn)
        if (this.axiosSvc.isAuthenticatedUser() && (this.currRoute === "/" || this.currRoute === "/login" || this.currRoute === "/signup")) {
          // If user is authenticated, navigate to the dashboard or home page
          this.isLoggedIn = true
          this.router.navigate(['/home']);
        }
      }
    })

    this.axiosSvc.isLoggedIn().subscribe(
      (bool) => {
        console.log('is logged in axios svc: ', bool)
        this.isLoggedIn = bool
      }
    )
  }
}
