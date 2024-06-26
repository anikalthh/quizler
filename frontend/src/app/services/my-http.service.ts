import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyHttpService {

  token: string = "";

  constructor(private http: HttpClient) { }

  get(url: string): any {
    return this.http.get(url);
  }
}
