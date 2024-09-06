// src/app/components/swiper/swiper.component.ts
import { Component, OnInit, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwiperComponent implements OnInit {
  images = [
    { url: 'assets/img/perro1.jpg', alt: 'Imagen 1' },
    { url: 'assets/img/perro2.jpg', alt: 'Imagen 2' },
    { url: 'assets/img/perro3.jpg', alt: 'Imagen 3' },
    { url: 'https://picsum.photos/id/1018/1000/600', alt: 'Imagen 4' },
  ];

  constructor() {}

  ngOnInit() {
    // Asegurarse de que Swiper se registre después de que el componente se inicialice
    register();
  }
}