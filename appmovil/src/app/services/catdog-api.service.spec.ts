// catdog-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatdogApiService {
  private catApiUrl = 'URL_DE_LA_API_DE_GATOS';
  private dogApiUrl = 'URL_DE_LA_API_DE_PERROS';

  constructor(private http: HttpClient) {}

  getRandomCat(): Observable<any> {
    return this.http.get(this.catApiUrl);
  }

  getRandomDog(): Observable<any> {
    return this.http.get(this.dogApiUrl);
  }
}
