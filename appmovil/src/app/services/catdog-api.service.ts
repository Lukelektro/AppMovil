import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatdogApiService {
  private catApiUrl = 'https://api.thecatapi.com/v1/images/search';
  private dogApiUrl = 'https://api.thedogapi.com/v1/images/search';

  constructor(private http: HttpClient) {} // Usa HttpClient

  getCats(): Observable<any> {
    return this.http.get(this.catApiUrl);
  }

  getDogs(): Observable<any> {
    return this.http.get(this.dogApiUrl);
  }
}
