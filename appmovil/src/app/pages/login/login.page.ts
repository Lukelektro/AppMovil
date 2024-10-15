import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ServicioAlmacenamiento } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service'; // servicio de autentificacion
import { ToastController } from '@ionic/angular';

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
    private authService: AuthService,
    private toastController: ToastController 
  ) {
    this.servicioAlmacenamiento.inicializar();
  }

  // mejore el metodo ngOnInit para que cargue las credenciales y haga el autologin mas rapido y eficiente
  async ngOnInit() {
    try {
      const credencialesCargadas = await this.cargarCredenciales();
  
      // Si las credenciales están cargadas y "Recordar" está activado, iniciar sesión directamente
      if (credencialesCargadas) {
        await this.iniciarSesion(true); // Autologin sin usar setTimeout
      }
    } catch (error) {
      console.error('Error durante la inicialización:', error);
    }
  }

  // Metodo asincronico para cargar las credenciales
  async cargarCredenciales(): Promise<boolean> {
    try {
      // Hacer todas las llamadas de una vez para mejorar el rendimiento (gracias joaco))
      const [emailAlmacenado, passwordAlmacenado, recordar] = await Promise.all([
        this.servicioAlmacenamiento.obtener('email'),
        this.servicioAlmacenamiento.obtener('password'),
        this.servicioAlmacenamiento.obtener('rememberMe')
      ]);
  
      // Validacion de las credenciales, Retornar true para indicar que son validas, en caso contrario da false
      if (this.validarEmail(emailAlmacenado) && this.validarPassword(passwordAlmacenado) && recordar) {
        this.email = emailAlmacenado;
        this.password = passwordAlmacenado;
        this.rememberMe = recordar;
        return true;
      }
      return false;
  
    } catch (error) { //en caso de cualquier error, se muestra en consola y ademas retorna false
      console.error('Error al cargar las credenciales:', error);
      return false;
    }
  }
  
  // Método asincrónico para iniciar sesión
  async iniciarSesion(autologin = false) {
    let loading: HTMLIonLoadingElement | null = null;

    try {
      // Si NO estuvo marcado el autologin, se presenta el loading con un mensajito
      if (!autologin) {
        loading = await this.loadingController.create({
          message: 'Iniciando sesión...', // Mensaje para el usuario
          duration: 3000,
        });
        await loading.present();
      }

      // Realizar la validación solo si no es autologin
      if (!autologin) {
        this.emailInvalid = !this.validarEmail(this.email);
        this.passwordInvalid = !this.validarPassword(this.password);

        // Si hay errores en el email o la contraseña, cerrar el loading y mostrar el mensaje de error
        if (this.emailInvalid || this.passwordInvalid) {
          if (loading) {
            await loading.dismiss(); // Cerrar el mensaje "Iniciando sesión..."
          }
          this.mostrarMensajeError('Por favor, revisa tu correo y contraseña.');
          return;
        }
      }

      // Usar AuthService para verificar las credenciales
      const loginExitoso = await this.authService.login(this.email, this.password);

      if (loginExitoso) {
        await this.gestionarCredenciales();
        if (loading) {
          await loading.dismiss();
        }
        this.router.navigate(['/tab/home']);
      } else {
        if (loading) {
          await loading.dismiss();
        }
        this.mostrarMensajeError('Credenciales incorrectas. Intenta de nuevo.');
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      if (loading) {
        await loading.dismiss();
      }
      this.mostrarMensajeError('Ocurrió un error al intentar iniciar sesión.');
    }
  }

  // Método para gestionar las credenciales
  private async gestionarCredenciales() {
    if (this.rememberMe) {
      await this.servicioAlmacenamiento.establecer('email', this.email);
      await this.servicioAlmacenamiento.establecer('password', this.password);
      await this.servicioAlmacenamiento.establecer('rememberMe', this.rememberMe);
    } else {
      await this.servicioAlmacenamiento.eliminar('email');
      await this.servicioAlmacenamiento.eliminar('password');
      await this.servicioAlmacenamiento.eliminar('rememberMe');
    }
  }

  // Método para mostrar mensajes de error en el UI
  private async mostrarMensajeError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
  }

  // Metodo para mostrar u ocultar la contraseña
  mostrarPassword() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }


  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  validarPassword(password: string): boolean {
    return password.length >= 6;
  }
}
