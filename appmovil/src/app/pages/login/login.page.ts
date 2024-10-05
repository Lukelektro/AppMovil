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
  rememberMe: boolean = false; // Para manejar el estado del checkbox
  emailInvalid = false;
  passwordInvalid = false;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private servicioAlmacenamiento: ServicioAlmacenamiento // Storage Service, en español porque me pierdo.
  ) {}

  ngOnInit() {
    this.cargarCredenciales(); // Cargar credenciales almacenadas al iniciar
  }

  // Cargamos email y password del StorageService
  async cargarCredenciales() {
    const emailAlmacenado = await this.servicioAlmacenamiento.obtener('email');
    const passwordAlmacenado = await this.servicioAlmacenamiento.obtener('password');

    if (emailAlmacenado) {
      this.email = emailAlmacenado;
    }

    if (passwordAlmacenado) {
      this.password = passwordAlmacenado;
    }

    this.rememberMe = !!emailAlmacenado; // Si hay email almacenado, recordar credenciales
  }

  // Alternar visibilidad de la contraseña
  mostrarPassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }

  // Lógica de login
  async iniciarSesion() {
    this.emailInvalid = !this.validarEmail(this.email);
    this.passwordInvalid = !this.validarPassword(this.password);

    if (this.emailInvalid || this.passwordInvalid) {
      return;
    }

    const loading = await this.loadingController.create({
      duration: 3000
    });

    await loading.present();

    // Esperar a que el loading termine
    await loading.onDidDismiss();

    // Guardar credenciales si "Recuérdame" está seleccionado
    if (this.rememberMe) {
      this.servicioAlmacenamiento.establecer('email', this.email);
      this.servicioAlmacenamiento.establecer('password', this.password); // Puedes eliminar esta línea si no quieres guardar la contraseña
    } else {
      this.servicioAlmacenamiento.eliminar('email');
      this.servicioAlmacenamiento.eliminar('password');
    }

    // Navegar a la siguiente página
    this.router.navigate(['/tab/home']);
  }

  // Validar el formato del email
  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex para validar el email
    return re.test(String(email).toLowerCase());
  }

  // Validar que la contraseña tenga al menos 6 caracteres
  validarPassword(password: string): boolean {
    return password.length >= 6;
  }
}
