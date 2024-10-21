// catdog-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CatdogApiService {
  private catApiUrl = environment.firebaseConfig.catApiUrl;
  private dogApiUrl = environment.firebaseConfig.dogApiUrl;
  private catApiKey = environment.firebaseConfig.catApiKey;
  private dogApiKey = environment.firebaseConfig.dogApiUrl; 

  constructor(private http: HttpClient) {}

  getRandomCat(): Observable<any> {
    return this.http.get<any>(`${this.catApiUrl}?api_key=${this.catApiKey}`);
  }

  getRandomDog(): Observable<any> {
    return this.http.get<any>(`${this.dogApiUrl}?api_key=${this.dogApiKey}`);
  }
}
