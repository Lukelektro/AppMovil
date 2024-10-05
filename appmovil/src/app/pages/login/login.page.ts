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
    private servicioAlmacenamiento: ServicioAlmacenamiento // Storage Service, en español porque me pierdo.
  ) {}

  async ngOnInit() {
    await this.cargarCredenciales();
    this.verificarAutenticacion();
  }

  // Cargamos email y password del StorageService
  async cargarCredenciales() {
    const emailAlmacenado = await this.servicioAlmacenamiento.obtener('email');
    const passwordAlmacenado = await this.servicioAlmacenamiento.obtener('password');
    const recordar = await this.servicioAlmacenamiento.obtener('rememberMe');

    if (emailAlmacenado) {
      this.email = emailAlmacenado;
    }

    if (passwordAlmacenado) {
      this.password = passwordAlmacenado;
    }

    this.rememberMe = !!recordar;
  }

    async verificarAutenticacion() {
      const recordar = await this.servicioAlmacenamiento.obtener('rememberMe');
  
      if (recordar) {
        this.router.navigate(['/tab/home']);
      }
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
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex para validar el email
    return re.test(String(email).toLowerCase());
  }

  // Validar que la contraseña tenga al menos 6 caracteres
  validarPassword(password: string): boolean {
    return password.length >= 6;
  }
}
