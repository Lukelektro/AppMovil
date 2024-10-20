import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from './firestore.service'; 
import { ServicioAlmacenamiento } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private estaAutenticado: boolean = false;

  constructor(private router: Router, private firestoreService: FirestoreService, private servicioAlmacenamiento: ServicioAlmacenamiento) {}

  // Método para iniciar sesión
  async login(email: string, password: string): Promise<boolean> {
    try {
      console.log(`Intentando iniciar sesión con email: ${email}`);
      
      // Busca el usuario directamente por email
      const user = await this.firestoreService.getDocumentByEmail('Usuarios', email);
      
      if (user && user.password === password) {
        console.log('Usuario encontrado. Inicio de sesión exitoso');
        this.estaAutenticado = true;
        return true;
      } else {
        console.log('Usuario no encontrado o credenciales incorrectas');
        return false;
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      return false;
    }
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
    await this.servicioAlmacenamiento.eliminar('Usuarios','rememberMe');

    this.router.navigate(['/login']);
  }

  // Método para verificar si el usuario está autenticado
  estaLogeado(): boolean {
    return this.estaAutenticado;
  }
}
