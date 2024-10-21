// catdog-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Esto hace que el servicio esté disponible en toda la aplicación
})
export class CatdogApiService {
  private catApiUrl = 'https://api.example.com/cats'; // Reemplaza con la URL real de tu API de gatos
  private dogApiUrl = 'https://api.example.com/dogs'; // Reemplaza con la URL real de tu API de perros

  constructor(private http: HttpClient) {}

  getRandomCat(): Observable<any> {
    return this.http.get<any>(this.catApiUrl); // Hacemos una solicitud GET a la API de gatos
  }

  getRandomDog(): Observable<any> {
    return this.http.get<any>(this.dogApiUrl); // Hacemos una solicitud GET a la API de perros
  }
}

