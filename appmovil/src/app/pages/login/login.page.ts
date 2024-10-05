import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ServicioAlmacenamiento } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  emailInvalid = false;
  passwordInvalid = false;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private servicioAlmacenamiento: ServicioAlmacenamiento
  ) {}

  async ngOnInit() {
    await this.cargarCredenciales(); // Cargar credenciales almacenadas
  }

  // Cargar credenciales almacenadas
  async cargarCredenciales() {
    const emailAlmacenado = await this.servicioAlmacenamiento.obtener('email');
    const passwordAlmacenado = await this.servicioAlmacenamiento.obtener('password');
    const recordar = await this.servicioAlmacenamiento.obtener('rememberMe');

    if (emailAlmacenado && passwordAlmacenado && recordar) {
      // Si se encuentra recordar, asignar valores y redirigir
      this.email = emailAlmacenado;
      this.password = passwordAlmacenado;
      this.rememberMe = recordar;

      // Ejecutar automáticamente iniciar sesión
      this.iniciarSesion(true); // Pasamos true para evitar doble carga
    }
  }

  // Alternar visibilidad de la contraseña
  mostrarPassword() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  // Lógica de login
  async iniciarSesion(autologin = false) {
    // Si se trata de un login automático, no mostrar el loader
    if (!autologin) {
      const loading = await this.loadingController.create({
        duration: 3000,
      });

      await loading.present();
      await loading.onDidDismiss();
    }

    // Validar los campos (evitamos la validación en autologin para no bloquear)
    if (!autologin) {
      this.emailInvalid = !this.validarEmail(this.email);
      this.passwordInvalid = !this.validarPassword(this.password);

      if (this.emailInvalid || this.passwordInvalid) {
        return;
      }
    }

    // Guardar credenciales si "Recuérdame" está seleccionado
    if (this.rememberMe) {
      await this.servicioAlmacenamiento.establecer('email', this.email);
      await this.servicioAlmacenamiento.establecer('password', this.password);
      await this.servicioAlmacenamiento.establecer('rememberMe', this.rememberMe);
    } else {
      await this.servicioAlmacenamiento.eliminar('email');
      await this.servicioAlmacenamiento.eliminar('password');
      await this.servicioAlmacenamiento.eliminar('rememberMe');
    }

    // Navegar a la siguiente página
    this.router.navigate(['/tab/home']);
  }

  // Validar el formato del email
  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Validar que la contraseña tenga al menos 6 caracteres
  validarPassword(password: string): boolean {
    return password.length >= 6;
  }
}
