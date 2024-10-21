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

  constructor(private catDogApiService: CatdogApiService) {}

  fetchCat() {
    this.catDogApiService.getRandomCat().subscribe({
      next: (response) => {
        this.catImageUrl = response[0].url;
      },
      error: (error) => {
        console.error('Error al obtener la imagen de gato', error);
      },
      complete: () => {
        console.log('Solicitud de gato completada');
      },
    });    
  }

  fetchDog() {
    this.catDogApiService.getRandomDog().subscribe({
      next: (response: any) => {
        this.dogImageUrl = response[0].url; // Asegúrate de que esta estructura sea correcta
      },
      error: (error: any) => {
        console.error('Error al obtener la imagen de perro', error);
      },
      complete: () => {
        console.log('Solicitud de perro completada');
      }
    });
  }
  
}
