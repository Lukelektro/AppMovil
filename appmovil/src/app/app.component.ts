import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Perfil', url: '/perfil', icon: 'person' },
    
  ];

  constructor() {}
}
