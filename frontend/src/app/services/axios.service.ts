import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AxiosService {

  // behavior subject
  public loggedIn = new BehaviorSubject<boolean>(this.isAuthenticatedUser())

  isLoggedIn() {
    return this.loggedIn.asObservable()
  }

  // dependencies
  private router = inject(Router)

  // vars
  userId : string = ''
  username : string = ''

  constructor() {
    axios.defaults.baseURL = "/api";
    axios.defaults.headers.post["Content-Type"] = "application/json"
  }

  getAuthToken(): string | null {
    return window.localStorage.getItem("auth_token");
  }

  setAuthToken(token: string | null): void {
    if (token !== null) {
      window.localStorage.setItem("auth_token", token);
    } else {
      window.localStorage.removeItem("auth_token");
    }
  }

  isAuthenticatedUser() {
    if (window.localStorage.getItem("auth_token") !== null) {
      return true
    } else {
      return false
    }
  }

  getUserId() {
    if (this.isAuthenticatedUser()) {
      const token = this.getAuthToken()
      if (token !== null) {
        const decodeToken: any = jwtDecode(token)
        this.userId = decodeToken.userid
        return this.userId
      } else {
        this.router.navigate(['/login'])
        return null
      }
    } else {
      this.router.navigate(['/login'])
      return null
    }
  }

  getUsername() {
    if (this.isAuthenticatedUser()) {
      const token = this.getAuthToken()
      if (token !== null) {
        const decodeToken: any = jwtDecode(token)
        this.username = decodeToken.sub
        return this.username
      } else {
        this.router.navigate(['/login'])
        return null
      }
    } else {
      this.router.navigate(['/login'])
      return null
    }
  }

  request(method: string, url: string, data: any): Promise<any> {
    let headers: any = {};

    if (this.getAuthToken() !== null) {
      headers = { "Authorization": "Bearer " + this.getAuthToken() };
    }

    return axios({
      method: method,
      url: url,
      data: data,
      headers: headers
    });
  }
}
