import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})

export class PerfilPage implements OnInit {

  constructor(private alertController: AlertController) {}

  perfil: any = {
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: ''
  };

  errores: any = {
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: ''
  };

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {

    const perfilGuardado = localStorage.getItem('perfil');
    if (perfilGuardado) {
      this.perfil = JSON.parse(perfilGuardado);
    } else {
      this.perfil = {
        nombre: 'Martín López',
        email: 'martin.lopez@ejemplo.com',
        telefono: '+1234567890',
        direccion: 'Calle Principal 123, Ciudad'
      };
    }

  }

  actualizarPerfil(evento: any, campo: string) {
    const valor = evento.detail.value;
    this.perfil[campo] = valor;
    this.validarCampo(campo, valor);
  }

  validarCampo(campo: string, valor: string) {
    switch (campo) {
      case 'nombre':
        this.errores.nombre = this.validarNombre(valor);
        break;
      case 'email':
        this.errores.email = this.validarEmail(valor);
        break;
      case 'password':
        this.errores.password = this.validarPassword(valor);
        break;
      case 'telefono':
        this.errores.telefono = this.validarTelefono(valor);
        break;
      case 'direccion':
        this.errores.direccion = this.validarDireccion(valor);
        break;
    }
  }

  validarNombre(nombre: string): string {
    return nombre.length < 2 ? 'El nombre debe tener al menos 2 caracteres' : '';
  }

  validarEmail(email: string): string {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return !regex.test(email) ? 'Email inválido' : '';
  }

  validarPassword(password: string): string {
    return password.length < 5 ? 'La contraseña debe tener al menos 5 caracteres' : '';
  }

  validarTelefono(telefono: string): string {
    const regex = /^\+?[0-9]{10,14}$/;
    return !regex.test(telefono) ? 'Teléfono inválido' : '';
  }

  validarDireccion(direccion: string): string {
    return direccion.length < 5 ? 'La dirección debe tener al menos 5 caracteres' : '';
  }

  

  guardarCambios() {
    if (this.formularioValido()) {
      localStorage.setItem('perfil', JSON.stringify(this.perfil));

      this.presentAlert();
      
      console.log('Cambios guardados:', this.perfil);
    } else {
      console.log('El formulario contiene errores');
    }
  }

  formularioValido(): boolean {
    const camposLlenos = Object.values(this.perfil).every(valor => valor !== '');
    const sinErrores = Object.values(this.errores).every(error => error === '');
    return camposLlenos && sinErrores;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Perfil Editado',
      message: 'Se ha editato su perfil correctamente',
      buttons: [{
        text: 'OK',
      }]
    });

    await alert.present();
  }

}
