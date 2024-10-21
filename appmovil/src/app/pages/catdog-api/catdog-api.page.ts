// catdog-api.page.ts
import { Component } from '@angular/core';
import { CatdogApiService } from '../../services/catdog-api.service';

@Component({
  selector: 'app-catdog-api',
  templateUrl: './catdog-api.page.html',
  styleUrls: ['./catdog-api.page.scss'],
})
export class CatdogApiPage {
  catImageUrl: string = '';
  dogImageUrl: string = '';

  constructor(private catDogApiService: CatdogApiService) {} // Inyección del servicio

  // Método para obtener una imagen de un gato
  fetchCat() {
    this.catDogApiService.getRandomCat().subscribe({
      next: (response: any) => {
        this.catImageUrl = response[0].url;
      },
      error: (error: any) => {
        console.error('Error al obtener la imagen de gato', error);
      }
    });
  }

  // Método para obtener una imagen de un perro
  fetchDog() {
    this.catDogApiService.getRandomDog().subscribe({
      next: (response: any) => {
        this.dogImageUrl = response[0].url;
      },
      error: (error: any) => {
        console.error('Error al obtener la imagen de perro', error);
      }
    });
  }
}
