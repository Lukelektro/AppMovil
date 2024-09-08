import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/ususario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  usuario: Usuario = new Usuario();
  emailInvalid = false;
  passwordInvalid = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  MostrarPassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }

  Login() {
    this.emailInvalid = !this.validarEmail(this.usuario.email);
    this.passwordInvalid = !this.validarPassword(this.usuario.password);

    if (this.emailInvalid || this.passwordInvalid) {
      return;
    }

    // Lógica para ingresar
    this.router.navigate(['/home']);
  }

  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //codigo regex pa validar el email
    return re.test(String(email).toLowerCase());
  }

  validarPassword(password: string): boolean {
    // Ejemplo de validación: al menos 6 caracteres
    return password.length >= 6;
  }
}