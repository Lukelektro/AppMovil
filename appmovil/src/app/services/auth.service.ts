import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InternetstatusService } from './internetstatus.service';
import { FirestoreService } from './firestore.service'; 
import { ServicioAlmacenamiento } from './storage.service';
import { SesionService } from './sesion.service';

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
    private internetstatusService: InternetstatusService,
    private sesionService: SesionService
  ) {}

  // Método de inicio de sesión en auth.service.ts
  // Método de inicio de sesión en auth.service.ts
async login(email: string, password: string, rememberMe: boolean): Promise<boolean> {
  try {
    console.log(`Intentando iniciar sesión con email: ${email}`);
    
    // Verificar si hay conexión a internet
    if (this.internetstatusService.estaConectado()) {
      console.log('Conexión a internet detectada, autenticando con Firebase');
      
      // Obtener el usuario por email
      const user = await this.firestoreService.getDocumentByEmail('Usuarios', email);
  
      if (user && user.password === password) {
        console.log('Usuario autenticado en Firebase');
        this.estaAutenticado = true;
        this.emailAutenticado = email;

        // Comprobar si ya hay una sesión activa para este usuario
        const sesionActiva = await this.sesionService.getSesionActiva(user.id);
        if (sesionActiva) {
          console.log('Ya existe una sesión activa para este usuario.');
        } else {
          // Crear una nueva sesión solo si no hay una activa
          await this.sesionService.crearSesion(user.id, rememberMe);
        }

        return true;
      } else {
        console.log('Credenciales incorrectas en Firebase');
        return false;
      }
    } else {
      console.log('Sin conexión a internet, autenticando con almacenamiento local');
      
      const emailAlmacenado = await this.servicioAlmacenamiento.obtener('Usuarios', 'email');
      const passwordAlmacenado = await this.servicioAlmacenamiento.obtener('Usuarios', 'password');
      
      if (emailAlmacenado === email && passwordAlmacenado === password) {
        console.log('Usuario autenticado en almacenamiento local');
        this.estaAutenticado = true;
        this.emailAutenticado = email;
        return true;
      } else {
        console.log('Credenciales incorrectas en almacenamiento local');
        return false;
      }
    }
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    return false;
  }
}



  // Método para salir (logout)
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
    return this.emailAutenticado;
  }
}
