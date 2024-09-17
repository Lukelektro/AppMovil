import { Component, OnInit, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
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
export class SwiperComponent implements OnInit, AfterViewInit {
  images = [
    { url: 'assets/img/Perro4.png', alt: 'Imagen 1' },
    { url: 'assets/img/Perro5.png', alt: 'Imagen 2' },
    { url: 'assets/img/Perro6.png', alt: 'Imagen 3' },
  ];

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    const swiperEl: any = document.querySelector('swiper-container');
    
    const swiperParams = {
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        clickable: true,
      },
      navigation: false,
    };
    
    Object.assign(swiperEl, swiperParams);
    swiperEl.initialize();
  }
}