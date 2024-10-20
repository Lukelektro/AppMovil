import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ServicioAlmacenamiento } from '../../services/storage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
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
    private FirestoreService: FirestoreService,
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

  // Método asincrónico para cargar las credenciales desde Firebase
  async cargarCredenciales(): Promise<boolean> {
    try {
      // Obtenemos el email que el usuario introduce
      const emailAlmacenado = this.email;

      if (!emailAlmacenado) {
        console.log('El email no está ingresado aún.');
        return false;
      }

      // Intentar obtener el documento del usuario con base en el email
      const usuario = await this.FirestoreService.getDocumentByEmail('Usuarios', emailAlmacenado);

      if (usuario) {
        console.log('Usuario encontrado:', usuario);

        // Validación de las credenciales
        if (this.validarEmail(usuario.email) && this.validarPassword(usuario.password)) {
          this.email = usuario.email;
          this.password = usuario.password;
          this.rememberMe = usuario.rememberMe;
          console.log('Credenciales válidas, iniciando sesión...');
          return true;
        } else {
          console.log('Credenciales inválidas');
          return false;
        }
      } else {
        console.log('No se encontró el usuario');
        return false;
      }

    } catch (error) {
      console.error('Error al cargar las credenciales:', error);
      return false;
    }
  }

  async iniciarSesion(autologin = false) {
    let loading: HTMLIonLoadingElement | null = null;
  
    try {
      if (!autologin) {
        loading = await this.loadingController.create({
          message: 'Iniciando sesión...',
          duration: 3000,
        });
        await loading.present();
      }
  
      // Validar email y password solo si no es autologin
      if (!autologin) {
        this.emailInvalid = !this.validarEmail(this.email);
        this.passwordInvalid = !this.validarPassword(this.password);
  
        if (this.emailInvalid || this.passwordInvalid) {
          if (loading) await loading.dismiss();
          this.mostrarMensajeError('Por favor, revisa tu correo y contraseña.');
          return;
        }
      }
  
      // Llama a AuthService para verificar las credenciales
      const loginExitoso = await this.authService.login(this.email, this.password);
  
      if (loginExitoso) {
        await this.gestionarCredenciales();
        if (loading) await loading.dismiss();
        this.router.navigate(['/tab/home']);
      } else {
        if (loading) await loading.dismiss();
        this.mostrarMensajeError('Credenciales incorrectas. Intenta de nuevo.');
      }
  
    } catch (error) {
      console.error('Error durante el proceso de inicio de sesión:', error);
      if (loading) await loading.dismiss();
      this.mostrarMensajeError('Ocurrió un error al intentar iniciar sesión.');
    }
  }  

  // Método para gestionar las credenciales
  private async gestionarCredenciales() {
    if (this.rememberMe) {
      await this.servicioAlmacenamiento.establecer('Usuarios','email', this.email);
      await this.servicioAlmacenamiento.establecer('Usuarios','password', this.password);
      await this.servicioAlmacenamiento.establecer('Usuarios','rememberMe', this.rememberMe);
    } else {
      await this.servicioAlmacenamiento.eliminar('Usuarios','email');
      await this.servicioAlmacenamiento.eliminar('Usuarios','password');
      await this.servicioAlmacenamiento.eliminar('Usuarios','rememberMe');
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
