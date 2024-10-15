import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ServicioAlmacenamiento } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service'; // Importa AuthService

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
    private servicioAlmacenamiento: ServicioAlmacenamiento,
    private authService: AuthService // Inyecta AuthService
  ) {}

  async ngOnInit() {
    await this.cargarCredenciales();
    if (this.rememberMe) {
      setTimeout(() => {
        this.iniciarSesion(true); 
      }, 500);
    }    
  }

  async cargarCredenciales() {
    const emailAlmacenado = await this.servicioAlmacenamiento.obtener('email');
    const passwordAlmacenado = await this.servicioAlmacenamiento.obtener('password');
    const recordar = await this.servicioAlmacenamiento.obtener('rememberMe');

    if (emailAlmacenado && passwordAlmacenado && recordar) {
      this.email = emailAlmacenado;
      this.password = passwordAlmacenado;
      this.rememberMe = recordar;
      this.iniciarSesion(true); // Intentar iniciar sesión automáticamente
    }
  }

  mostrarPassword() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  async iniciarSesion(autologin = false) {
    if (!autologin) {
      const loading = await this.loadingController.create({
        duration: 3000,
      });
      await loading.present();
      await loading.onDidDismiss();
    }

    if (!autologin) {
      this.emailInvalid = !this.validarEmail(this.email);
      this.passwordInvalid = !this.validarPassword(this.password);

      if (this.emailInvalid || this.passwordInvalid) {
        return; // Si hay errores de validación, no continuar
      }
    }

    // Usar AuthService para verificar las credenciales
    const loginSuccessful = this.authService.login(this.email, this.password);

    if (loginSuccessful) {
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

      // Navegar a la página de inicio (o tab/home)
      this.router.navigate(['/tab/home']);
    } else {
      alert('Credenciales incorrectas');
    }
  }

  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  validarPassword(password: string): boolean {
    return password.length >= 6;
  }
}
