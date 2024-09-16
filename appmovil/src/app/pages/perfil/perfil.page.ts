import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  perfil = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  }; 

  constructor() { }

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    const perfilGuardado = localStorage.getItem('perfil');
    if (perfilGuardado) {
      this.perfil = JSON.parse(perfilGuardado);
    } else {
      // Valores por defecto si no hay perfil guardado
      this.perfil = {
        nombre: 'Martín López',
        email: 'martin.lopez@ejemplo.com',
        telefono: '+1234567890',
        direccion: 'Calle Principal 123, Ciudad'
      };
    }
  }

  guardarCambios() {
    localStorage.setItem('perfil', JSON.stringify(this.perfil));
    // Aquí podrías añadir una notificación de que se guardaron los cambios
  }

  

}
