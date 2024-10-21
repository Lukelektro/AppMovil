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

  constructor(private catDogApiService: CatDogApiService) {}

  // Obtener imagen de un gato
  fetchCat() {
    this.CatdogApiService.getRandomCat().subscribe(
      (response) => {
        this.catImageUrl = response[0].url;
      },
      (error) => {
        console.error('Error al obtener la imagen de gato', error);
      }
    );
  }

  // Obtener imagen de un perro
  fetchDog() {
    this.CatdogApiService.getRandomDog().subscribe(
      (response) => {
        this.dogImageUrl = response[0].url;
      },
      (error) => {
        console.error('Error al obtener la imagen de perro', error);
      }
    );
  }
}
