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

    // Método de inicio de sesión
    async login(email: string, password: string, rememberMe: boolean): Promise<boolean> {
      try {
        if (this.internetstatusService.estaConectado()) {
          console.log('Conexión a internet detectada, autenticando con Firebase');
          
          const user = await this.firestoreService.getDocumentByEmail('Usuarios', email);
      
          if (user && user.password === password) {
            console.log('Usuario autenticado en Firebase');
            this.estaAutenticado = true;
            this.emailAutenticado = email;
    
            try {
              // Check for active session
              const sesionActiva = await this.sesionService.getSesionActiva(user.id);
              
              if (sesionActiva) {
                console.log('Sesión activa encontrada');
                return true;
              }
    
              // Create new session
              await this.sesionService.crearSesion(user.id, rememberMe);
              return true;
              
            } catch (error) {
              console.error('Error en gestión de sesiones:', error);
              // Continue with authentication even if session management fails
              return true;
            }
          }
        }
        return false;
      } catch (error) {
        console.error('Error en login:', error);
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
