import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { EmailService } from '../../services/email.service'; 
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.page.html',
  styleUrls: ['./restore-password.page.scss'],
})
export class RestorePasswordPage {
  email: string = '';
  emailError: string = '';
  isValidEmail: boolean = false;

  constructor(
    private alertController: AlertController, 
    private navController: NavController,
    private EmailService: EmailService,
    private loadingController: LoadingController
  ) {}

  validateEmail() {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!this.email) {
      this.emailError = 'El correo electrónico es requerido.';
      this.isValidEmail = false;
    } else if (!emailRegex.test(this.email)) {
      this.emailError = 'Por favor, ingrese un correo electrónico válido.';
      this.isValidEmail = false;
    } else {
      this.emailError = '';
      this.isValidEmail = true;
    }
  }

  async onSubmit() {
    this.validateEmail();

    if (this.isValidEmail) {
      // Mostrar loading
      const loading = await this.loadingController.create({
        message: 'Enviando correo de recuperación...',
      });
      await loading.present();

      try {
        // Llamar al servicio de recuperación de contraseña
        const result = await this.EmailService.sendPasswordRecoveryEmail(this.email);

        // Cerrar loading
        await loading.dismiss();

        if (result.success) {
          // Mostrar el modal de confirmación
          await this.presentSuccessAlert();
        } else {
          // Mostrar alerta de error
          await this.presentErrorAlert(result.message);
        }
      } catch (error) {
        // Cerrar loading
        await loading.dismiss();

        // Mostrar alerta de error genérico
        await this.presentErrorAlert('Ocurrió un error al enviar el correo de recuperación');
      }
    }
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Correo Enviado',
      message: `Se ha enviado un código de recuperación al correo ${this.email}. Por favor, revisa tu bandeja de entrada.`,
      buttons: [{
        text: 'OK',
        handler: () => {
          // Navegar a la página de verificación de código
          this.navController.navigateForward('/verify-code', {
            queryParams: {
              email: this.email
            }
          });
        }
      }]
    });

    await alert.present();
  }

  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  goBack() {
    this.navController.back();
  }
}