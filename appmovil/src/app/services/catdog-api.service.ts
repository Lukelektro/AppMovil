// catdog-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatdogApiService {
  private catApiUrl = 'URL_DE_LA_API_DE_GATOS'; // Reemplaza con tu URL real
  private dogApiUrl = 'URL_DE_LA_API_DE_PERROS'; // Reemplaza con tu URL real

  constructor(private http: HttpClient) {}

  getRandomCat(): Observable<any> {
    return this.http.get<any>(this.catApiUrl);
  }

  getRandomDog(): Observable<any> {
    return this.http.get<any>(this.dogApiUrl);
  }

  getCats(): Observable<any[]> {
    return this.http.get<any[]>(this.catApiUrl); // Opcional: si tienes un endpoint para todos los gatos
  }

  getDogs(): Observable<any[]> {
    return this.http.get<any[]>(this.dogApiUrl); // Opcional: si tienes un endpoint para todos los perros
  }
}
