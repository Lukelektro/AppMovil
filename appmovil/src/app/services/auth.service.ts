import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private estaAutenticado: boolean = false;

  constructor(private router: Router) {}

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
  logout() {
    this.estaAutenticado = false;
    this.router.navigate(['/login']);
  }

  // Método para verificar si el usuario está autenticado
  estaLogeado(): boolean {
    return this.estaAutenticado;
  }
}
