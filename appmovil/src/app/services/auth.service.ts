import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InternetstatusService } from './internetstatus.service';
import { FirestoreService } from './firestore.service'; 
import { ServicioAlmacenamiento } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private estaAutenticado: boolean = false;
  private emailAutenticado: string = '';

  constructor(
    private router: Router, 
    private firestoreService: FirestoreService, 
    private servicioAlmacenamiento: ServicioAlmacenamiento,
    private internetstatusService: InternetstatusService
  ) {}

  async login(email: string, password: string): Promise<boolean> {
    try {
      console.log(`Intentando iniciar sesión con email: ${email}`);
  
      // Verificar si hay conexión a internet
      if (this.internetstatusService.estaConectado()) {
        console.log('Conexión a internet detectada, autenticando con Firebase');
        
        // Utilizar el método que ya tienes para obtener el documento por email
        const user = await this.firestoreService.getDocumentByEmail('Usuarios', email);
  
        if (user && user.password === password) {
          console.log('Usuario autenticado en Firebase');
          this.estaAutenticado = true;
          this.emailAutenticado = email;
          return true;
        } else {
          console.log('Credenciales incorrectas en Firebase');
          return false;
        }
      } else {
        console.log('Sin conexión a internet, autenticando con almacenamiento local');
        
        // Si no hay conexión, verifica en el almacenamiento local
        const emailAlmacenado = await this.servicioAlmacenamiento.obtener('Usuarios', 'email');
        const passwordAlmacenado = await this.servicioAlmacenamiento.obtener('Usuarios', 'password');
        
        if (emailAlmacenado === email && passwordAlmacenado === password) {
          console.log('Usuario autenticado en almacenamiento local');
          this.estaAutenticado = true;
          this.emailAutenticado = email;  // Guardar el email autenticado
          return true;
        } else {
          console.log('Credenciales incorrectas en almacenamiento local');
          return false;
        }
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      return false;  // Error durante la validación
    }
  }
  
  // Método para salir (no implementado aun)
  async logout() {
    this.estaAutenticado = false;

    // Eliminar las credenciales almacenadas cuando se cierre sesión
    await this.servicioAlmacenamiento.eliminar('Usuarios', 'rememberMe');

    this.router.navigate(['/login']);
  }

  // Método para verificar si el usuario está autenticado
  estaLogeado(): boolean {
    return this.estaAutenticado;
  }

  // Método para obtener el email del usuario autenticado
  getAuthenticatedEmail(): string {
    return this.emailAutenticado;  // Retorna el email autenticado
  }
}

