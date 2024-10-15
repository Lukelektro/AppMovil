import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioAlmacenamiento } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private estaAutenticado: boolean = false;

  constructor(private router: Router, private servicioAlmacenamiento: ServicioAlmacenamiento) {}

  // Método para iniciar sesión
  login(email: string, password: string): boolean {

      // Simulación de usuarios (despues se usará la base de datos real, solo para pruebas)
    const users = [
      { email: 'pirulin@duro.com', password: '123123' },
    ];

    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
      this.estaAutenticado = true;
      return true; // Inicio de sesión exitoso
    }
    return false; // Credenciales incorrectas
  }

  // Método para salir (no implementado aun)
  async logout() {
    this.estaAutenticado = false;

    // Eliminar las credenciales almacenadas cuando se cierre sesión
    /* plantie en este caso, que el usuario final quien cierra sesion, no quiere realmente que se eliminen las credenciales
    quizas esto es un error, pero es una idea que se me ocurrio, si se quiere que se eliminen las credenciales, descomentar las siguientes lineas
    await this.servicioAlmacenamiento.eliminar('email');
    await this.servicioAlmacenamiento.eliminar('password');
    */
    await this.servicioAlmacenamiento.eliminar('rememberMe');

    this.router.navigate(['/login']);
  }

  // Método para verificar si el usuario está autenticado
  estaLogeado(): boolean {
    return this.estaAutenticado;
  }
}
