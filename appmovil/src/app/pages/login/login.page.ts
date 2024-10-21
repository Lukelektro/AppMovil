import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ServicioAlmacenamiento } from '../../services/storage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { SesionService } from '../../services/sesion.service';  // Importa el SesionService
import { InternetstatusService } from '../../services/internetstatus.service';
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
  emailInvalid = false;
  passwordInvalid = false;
  rememberMe: boolean = false;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private servicioAlmacenamiento: ServicioAlmacenamiento,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private sesionService: SesionService,  // Inyecta el servicio de sesión
    private toastController: ToastController,
    private internetstatusService: InternetstatusService
  ) {
    this.servicioAlmacenamiento.inicializar();
  }

  async ngOnInit() {
    try {
      const emailAlmacenado = await this.servicioAlmacenamiento.obtener('Usuarios', 'email');
      const passwordAlmacenado = await this.servicioAlmacenamiento.obtener('Usuarios', 'password');
      
      console.log('Credenciales almacenadas:', { emailAlmacenado, passwordAlmacenado });
      
      if (emailAlmacenado && passwordAlmacenado) {
        this.email = emailAlmacenado;
        this.password = passwordAlmacenado;
        
        const rememberMeAlmacenado = await this.servicioAlmacenamiento.obtener('Usuarios', 'rememberMe');
        console.log('Estado de rememberMe:', rememberMeAlmacenado);
  
        if (rememberMeAlmacenado) {
          this.rememberMe = true;
          console.log("Intentando iniciar sesión automáticamente...");
          await this.iniciarSesion(true);
        }
      }
    } catch (error) {
      console.error('Error durante la carga de credenciales almacenadas:', error);
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
  
      // Aquí pasamos el valor correcto de rememberMe al servicio de autenticación
      const loginExitoso = await this.authService.login(this.email, this.password, this.rememberMe);
  
      if (loginExitoso) {
        console.log('Login exitoso');
        await this.gestionarCredenciales();  // Gestionar credenciales locales si rememberMe está activado
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
  
  

  private async gestionarCredenciales() {
    if (this.rememberMe) {
      await this.servicioAlmacenamiento.establecer('Usuarios', 'email', this.email);
      await this.servicioAlmacenamiento.establecer('Usuarios', 'password', this.password);
      await this.servicioAlmacenamiento.establecer('Usuarios', 'rememberMe', true);  // Guardamos también el estado del checkbox
    } else {
      await this.servicioAlmacenamiento.eliminar('Usuarios', 'email');
      await this.servicioAlmacenamiento.eliminar('Usuarios', 'password');
      await this.servicioAlmacenamiento.eliminar('Usuarios', 'rememberMe');  // Eliminamos el estado del checkbox si no se quiere recordar
    }
  }
  
  private async mostrarMensajeError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
  }

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

  onRememberMeToggle(event: any) {
    this.rememberMe = event.detail.checked;
    console.log('RememberMe activado:', this.rememberMe);
  }
  
}
