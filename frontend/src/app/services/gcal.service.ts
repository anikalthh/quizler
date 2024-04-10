import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudySession } from '../models';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GcalService {

  constructor(private http: HttpClient) { }

  sendEventDetails(eventDetails: StudySession | null) {
    return firstValueFrom(this.http.post('/api/schedule/google/calendar', eventDetails))
  }
}
