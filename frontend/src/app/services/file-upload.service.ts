import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  // HTTP POST (upload document)
  uploadDocument(formData: FormData) {
    console.log('>>> making a http post req to send file into SB')
    return firstValueFrom(this.http.post<any>('http://localhost:8080/api/file/upload', formData))
  }

  // HTTP GET EXTRACTED TEXT
  getExtractedText(docId: string) {
    return firstValueFrom(this.http.get<any>(`http://localhost:8080/api/file/extracted/${docId}`))
  }

}
